import { Request, Response } from 'express';
import Portfolio from '../models/portfolioModel';
import Order from '../models/orderModel';
import Stock from '../models/stockModel';
import axios from 'axios';


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

    public static buyMarketOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const response = await axios.get(
                `https://finnhub.io/api/v1/quote?symbol=${req.body.ticker}&token=c5vln0iad3ibtqnna830`);
            const units = parseInt(req.body.units, 10);
            const totalCost = response.data.c * units;
            const marketPrice = response.data.c;
            if (req.user.availableBalance - totalCost < 0) {
                throw new Error('Available Balance too low to purchase stocks');
            }
            const portfolio = await Portfolio.findOne({
                user: req.user.id,
                name: req.body.portfolio
            });
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
                    existingStock.numUnits * existingStock.averagePrice +
                    units * marketPrice) /
                    (existingStock.numUnits + units);

                existingStock.numUnits += units;
                existingStock.averagePrice = avg;

                req.user.balance = 
                    (req.user.balance - totalCost).toFixed(2);
                req.user.availableBalance =
                    (req.user.availableBalance - totalCost).toFixed(2);

                await existingStock.save();
                await req.user.save();
            }

            const order = new Order({
                user: req.user.id,
                portfolio: req.body.portfolio,
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
                name: req.body.portfolio
            });

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

            const avg =
                (existingStock.numUnits * existingStock.averagePrice -
                    units * marketPrice) /
                (existingStock.numUnits - units);

            req.user.balance = (req.user.balance + totalCost).toFixed(2);
            req.user.availableBalance = (
                req.user.availableBalance + totalCost).toFixed(2);

            existingStock.numUnits -= units;
            existingStock.averagePrice = avg;

            if (existingStock.numUnits == 0) {
                existingStock.delete();
            } else {
                await existingStock.save();
            }

            const order = new Order({
                user: req.user.id,
                portfolio: req.body.portfolio,
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

}