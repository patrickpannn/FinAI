import { Request, Response } from 'express';
import Portfolio from '../models/portfolioModel';
import Order from '../models/orderModel';
import Stock from '../models/stockModel';
import axios from 'axios';

enum direction {
    Sell = "SELL",
    Buy = "BUY",
}

export default class OrderController {
    public static list = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            if (Object.keys(req.body).length) {
                throw new Error('Inputs are given but not needed.');
            }

            const orders = await Order.find({ user: req.user._id });

            let list = [];

            for (let i = 0; i < orders.length; i++) {
                let orderObj = await orders[i].getObject();
                list.push(orderObj);
            }

            res.status(200).json(list);
        } catch (e) {
            res.status(400).json({ error: 'List of Orders Bad Request' });
        }
    };

    public static buyLimitOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if(!req.body.direction || req.body.direction !== direction.Buy)
            {
                throw new Error('Direction given is not correct for this route');
            }
            if(req.user.availableBalance - req.body.units * req.body.setPrice < 0)
            {
                throw new Error('Available Balance is too low to make this order');
            }

            const portfolio = await Portfolio.findOne({
                user: req.user.id,
                name: req.body.portfolio
            });
            if(!portfolio)
            {
                throw new Error('Could not find portfolio');
            }

            const existingOrder = await Order.findOne({ 
                user: req.user.id, 
                portfolio: portfolio.id,
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
                    portfolio: portfolio.id,
                    numUnits: req.body.units, 
                    executePrice : req.body.setPrice,
                    ticker: req.body.ticker, 
                    name: req.body.name, 
                    direction: req.body.direction });
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
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static sellLimitOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if(!req.body.direction || req.body.direction !== direction.Sell)
            {
                throw new Error('Direction given is not correct for this route');
            }
            const portfolio = await Portfolio.findOne({
                user: req.user.id,
                name: req.body.portfolio
            });
            if(!portfolio)
            {
                throw new Error('Could not find portfolio');
            }
            
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
                portfolio: portfolio.id,
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
                    numUnits: portfolio.id, 
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
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static cancelOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const portfolio = await Portfolio.findOne({
                user: req.user.id,
                name: req.body.portfolio
            });
            if(!portfolio)
            {
                throw new Error('Could not find portfolio');
            }

            const order = await Order.findOne({ 
                user: req.user.id, 
                portfolio: portfolio.id,
                ticker: req.body.ticker,
                executePrice: req.body.setPrice,
                units: req.body.units
            });
            if(!order)
            {
                throw new Error("This order doesn't exist");
            }

            if(req.body.direction !== direction.Buy && req.body.direction !== direction.Sell)
            {
                throw new Error('Bad Request');
            }

            if(req.body.direction === direction.Buy)
            {
                req.user.availableBalance += req.body.setPrice * req.body.units;
                req.user.save();
                order.delete();
            } else
            {

                const stock = await Stock.findOne({ 
                    portfolio: portfolio.id,
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
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static buyMarketOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const portfolio = await Portfolio.findOne({
                user: req.user.id,
                name: req.body.portfolio
            });
            if(!portfolio)
            {
                throw new Error('Could not find portfolio');
            }

            const response = await axios.get(
                `https://finnhub.io/api/v1/quote?symbol=${req.body.ticker}&token=c5vln0iad3ibtqnna830`);
            const units = parseInt(req.body.units, 10);
            const totalCost = response.data.c * units;
            const marketPrice = response.data.c;
            if (req.user.availableBalance - totalCost < 0) {
                throw new Error('Available Balance too low to purchase stocks');
            }
            const existingStock = await Stock.findOne({
                portfolio: portfolio?.id,
                ticker: req.body.ticker
            });

            if (!existingStock) {

                const stock = new Stock({
                    portfolio: portfolio?.id,
                    ticker: req.body.ticker,
                    name: req.body.name,
                    averagePrice: marketPrice,
                    numUnits: units });

                if (!stock) {
                    throw new Error('Could not make stock');
                }
                req.user.balance = (req.user.balance - totalCost).toFixed(2);
                req.user.availableBalance =
                    (req.user.availableBalance - totalCost).toFixed(2);

                await stock.save();
                await req.user.save();
            } else {
                const avg = (
                    (existingStock.numUnits * existingStock.averagePrice +
                    units * marketPrice) / (existingStock.numUnits + units)
                                                                ).toFixed(2);

                existingStock.numUnits += units;
                existingStock.averagePrice = parseFloat(avg);

                req.user.balance = 
                    (req.user.balance - totalCost).toFixed(2);
                req.user.availableBalance =
                    (req.user.availableBalance - totalCost).toFixed(2);

                await existingStock.save();
                await req.user.save();
            }

            const order = new Order({
                user: req.user.id,
                portfolio: portfolio.id,
                numUnits: units,
                executePrice: marketPrice,
                ticker: req.body.ticker,
                name: req.body.name,
                executed: true,
                direction: "BUY" });
            if(!order)
            {
                throw new Error('Could not make order');
            }
            await order.save();

            res.status(200).json({ response: 'Successful' });
        } catch (e) {
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
                name: req.body.portfolio
            });
            if(!portfolio)
            {
                throw new Error('Could not find portfolio');
            }

            const existingStock = await Stock.findOne({
                portfolio: portfolio?.id,
                ticker: req.body.ticker });
            if (!existingStock) {
                throw new Error('This stock doesnt exist');
            }

            const response = await axios.get(
                `https://finnhub.io/api/v1/quote?symbol=${req.body.ticker}&token=c5vln0iad3ibtqnna830`);
            const units = parseInt(req.body.units, 10);
            const totalCost = response.data.c * units;
            const marketPrice = response.data.c;

            const avg = (
                (existingStock.numUnits * existingStock.averagePrice -
                units * marketPrice) / (existingStock.numUnits - units)
                                                            ).toFixed(2);

            req.user.balance = (req.user.balance + totalCost).toFixed(2);
            req.user.availableBalance = (
                req.user.availableBalance + totalCost).toFixed(2);

            existingStock.numUnits -= units;
            existingStock.averagePrice = parseFloat(avg);

            if (existingStock.numUnits == 0) {
                existingStock.delete();
            } else {
                await existingStock.save();
            }

            const order = new Order({
                user: req.user.id,
                portfolio: portfolio.id,
                numUnits: units,
                executePrice: marketPrice,
                ticker: req.body.ticker,
                name: req.body.name,
                executed: true,
                direction: "SELL" });
            if(!order)
            {
                throw new Error('Could not make order');
            }
            await order.save();

            await req.user.save();

            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static test = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const portfolio = await Portfolio.findOne({
                user: req.user.id,
                name: req.body.portfolio
            });
            if(!portfolio)
            {
                throw new Error('Could not find portfolio');
            }


            const existingOrder = await Order.findOne({ 
                user: req.user.id, 
                portfolio: portfolio.id,
                ticker: req.body.ticker,
                executePrice: req.body.setPrice,
                direction: req.body.direction
            });
            if(!existingOrder)
            {
                throw new Error('nonono');
            }
            existingOrder.executed = true;
            existingOrder.save();
            res.status(200).json({ response: 'Successful'});
        }
        catch (e)
        {
            res.status(400).json({ error: 'Bad Request'});
        }
    };

}