import { Request, Response } from 'express';
import Order from '../models/orderModel';
import User from '../models/userModel';
import Portfolio from '../models/portfolioModel';
import Stock from '../models/stockModel';
//import fetch from 'node-fetch';
//const fetch = require('node-fetch');
import axios from 'axios';

enum Direction {
    Sell= "SELL",
    Buy= "BUY",
}

export default class OrderController {
    public static buyLimitOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            /*
            const order = await Order.findOne({ user: req.user.id, ticker: req.body.ticker });
            if(!order)
            {
                throw new Error('Order could not be loaded');
            }
            */
            if(req.body.direction !== Direction.Buy)
            {
                throw new Error('Direction given is not correct for this route');
            }
            if(req.user.availableBalance - req.body.units * req.body.setPrice < 0)
            {
                throw new Error('Available Balance is too low to make this order');
            }
            const order = new Order({ 
                user: req.user.id, 
                numUnits: req.body.units, 
                executePrice : req.body.setPrice,
                ticker: req.body.ticker, 
                name: req.body.name, 
                direction: req.body.direction,
                portfolio: req.body.portfolio });
            if(!order)
            {
                throw new Error('Order cannot be made');
            }
            req.user.availableBalance = req.user.availableBalance - req.body.setPrice * req.body.units;
            await req.user.save();
            await order.save();

            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            console.log(e);
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static sellLimitOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if(req.body.direction !== Direction.Sell)
            {
                throw new Error('Direction given is not correct for this route');
            }
            const portfolio = await Portfolio.findOne({ 
                user: req.user.id, 
                name: req.body.portfolio });
            
            const stock = await Stock.findOne({ 
                portfolio: portfolio?.id, 
                ticker : req.body.ticker});
            if(!stock)
            {
                throw new Error('Stock does not exist in portfolio');
            }
            if(stock.numUnits - req.body.units < 0){
                throw new Error('Cannot sell more shares than you own');
            }
            stock.numUnits = stock.numUnits - req.body.units;
            const order = new Order({ 
                user: req.user.id,
                numUnits: req.body.units, 
                executePrice: req.body.setPrice,
                ticker: req.body.ticker, 
                name: req.body.name, 
                direction: req.body.direction, 
                portfolio: req.body.portfolio });
            if(!order)
            {
                throw new Error('Order cannot be made');
            }
            await order.save();
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            console.log(e)
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static buyMarketOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${req.body.ticker}&token=c5vln0iad3ibtqnna830`);
            const totalCost = response.data.c * req.body.units;
            if(req.user.availableBalance - totalCost < 0)
            {
                throw new Error('Availaable Balance too low to purchase stocks');
            }
            
            const portfolio = await Portfolio.findOne({ 
                user: req.user.id,
                name: req.body.portfolio });
            const existingStock = await Stock.findOne({ 
                portfolio: portfolio?.id,
                ticker: req.body.ticker });
            if(!existingStock){
                const stock = new Stock({
                    portfolio: portfolio?.id, 
                    ticker: req.body.ticker,
                    stockName: req.body.stockName, 
                    averagePrice : response.data.c, 
                    numUnits: req.body.numUnits
                });
                if(!stock)
                {
                    throw new Error('Could not make stock');
                }
                req.user.balance = req.user.balance - totalCost;
                req.user.balance = req.user.availableBalance - totalCost;
                await stock.save();
            }

                     
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            console.log(e);
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static sellMarketOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static cancelOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}