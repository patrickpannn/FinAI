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
            if(req.body.direction !== Direction.Buy)
            {
                throw new Error('Direction given is not correct for this route');
            }
            if(req.user.availableBalance - req.body.units * req.body.setPrice < 0)
            {
                throw new Error('Available Balance is too low to make this order');
            }

            const existingOrder = await Order.findOne({ 
                user: req.user.id, 
                portfolio: req.body.portfolio,
                ticker: req.body.ticker,
                executePrice: req.body.setPrice,
                direction: req.body.direction
            });
            if(existingOrder)
            {
                existingOrder.numUnits += req.body.units;
                await existingOrder.save();
            } else
            {
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
                order.save();

            }
            req.user.availableBalance = req.user.availableBalance - req.body.setPrice * req.body.units;
            await req.user.save();

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

            const existingOrder = await Order.findOne({ 
                user: req.user.id, 
                portfolio: req.body.portfolio,
                ticker: req.body.ticker,
                executePrice: req.body.setPrice,
                direction: req.body.direction
            });
            if(existingOrder)
            {
                existingOrder.numUnits += req.body.units;
                await existingOrder.save();
            } else
            {
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
            }

            stock.numUnits -= req.body.units;
            await stock.save();

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
            const marketPrice = response.data.c;
            if(req.user.availableBalance - totalCost < 0)
            {
                throw new Error('Available Balance too low to purchase stocks');
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
                    name: req.body.name, 
                    averagePrice : marketPrice, 
                    numUnits: req.body.units
                });
                if(!stock)
                {
                    throw new Error('Could not make stock');
                }
                req.user.balance = (req.user.balance - totalCost).toFixed(2);
                req.user.availableBalance = (req.user.availableBalance - totalCost).toFixed(2);
                await stock.save();
                await req.user.save();
            } else
            {
                const avg = (existingStock.numUnits * existingStock.averagePrice +
                    req.body.units * marketPrice) / (existingStock.numUnits + req.body.units);
                existingStock.numUnits += req.body.units;
                existingStock.averagePrice = avg;
                req.user.balance = (req.user.balance - totalCost).toFixed(2);
                req.user.availableBalance = (req.user.availableBalance - totalCost).toFixed(2);
                await existingStock.save();
                await req.user.save();
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

            const portfolio = await Portfolio.findOne({ 
                user: req.user.id,
                name: req.body.portfolio });
            const existingStock = await Stock.findOne({ 
                portfolio: portfolio?.id,
                ticker: req.body.ticker });
            if(!existingStock)
            {
                throw new Error('This stock doesnt exist');
            }

            const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${req.body.ticker}&token=c5vln0iad3ibtqnna830`);
            const totalCost = response.data.c * req.body.units;
            const marketPrice = response.data.c;
            const avg = (existingStock.numUnits * existingStock.averagePrice -
                req.body.units * marketPrice) / (existingStock.numUnits - req.body.units);
                

            req.user.balance = (req.user.balance + totalCost).toFixed(2);
            req.user.availableBalance = (req.user.availableBalance + totalCost).toFixed(2);

            existingStock.numUnits -= req.body.units;
            existingStock.averagePrice = avg;
            if(existingStock.numUnits == 0)
            {
                existingStock.delete();
            } else
            {
                await existingStock.save();
            }
            await req.user.save();
            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static cancelOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const order = await Order.findOne({ 
                user: req.user.id, 
                portfolio: req.body.portfolio,
                ticker: req.body.ticker,
                executePrice: req.body.setPrice,
                units: req.body.units
            });
            if(!order)
            {
                throw new Error("This order doesn't exist");
            }

            if(req.body.direction == Direction.Buy)
            {
                req.user.availableBalance += req.body.setPrice * req.body.units;
                req.user.save();
                order.delete();
            } else
            {
                const portfolio = await Portfolio.findOne({ 
                    user: req.user.id,
                    name: req.body.portfolio });

                const stock = await Stock.findOne({ 
                    portfolio: portfolio?.id,
                    ticker: req.body.ticker
                })
                if(!stock)
                {
                    throw new Error("Cant access a stock that doesnt exist");
                }

                stock.numUnits += req.body.units;
                stock.save();
                order.delete();
            }

            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            console.log(e);
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}