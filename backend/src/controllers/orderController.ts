import { Request, Response } from 'express';
import Order from '../models/orderModel';
import Stock from '../models/stockModel';
import axios from 'axios';

enum Direction {
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
            if (req.user.numOrders + 1 > 10) {
                throw new Error('Exceed maximum number of orders');
            }

            if (req.body.direction !== Direction.Buy) {
                throw new Error('Direction given is not correct for this route');
            }

            const units = parseFloat(req.body.units);
            const price = parseFloat(req.body.setPrice);

            if (req.user.availableBalance -
                units * price < 0) {
                throw new Error('Available Balance is too low to make this order');
            }

            const order = new Order({
                user: req.user.id,
                portfolio: req.portfolio.id,
                numUnits: units,
                executePrice: price,
                ticker: req.body.ticker,
                name: req.body.name,
                direction: req.body.direction
            });

            await order.save();

            req.user.availableBalance =
                req.user.availableBalance - price * units;
            req.user.numOrders++;
            await req.user.save();

            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static sellLimitOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if (req.user.numOrders + 1 > 10) {
                throw new Error('Exceed maximum number of orders');
            }

            if (req.body.direction !== Direction.Sell) {
                throw new Error('Direction given is not correct for this route');
            }

            const stock = await Stock.findOne({
                portfolio: req.portfolio.id,
                ticker: req.body.ticker
            });

            if (!stock) {
                throw new Error('Stock does not exist in portfolio');
            }

            const units = parseFloat(req.body.units);
            const price = parseFloat(req.body.setPrice);

            if (stock.numUnits - units < 0) {
                throw new Error('Cannot sell more shares than you own');
            }

            const order = new Order({
                user: req.user.id,
                numUnits: units,
                executePrice: price,
                ticker: req.body.ticker,
                name: req.body.name,
                direction: req.body.direction,
                portfolio: req.portfolio.id
            });

            await order.save();

            stock.numUnits -= units;
            await stock.save();

            req.user.numOrders++;
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
            const units = parseFloat(req.body.units);
            const price = parseFloat(req.body.setPrice);
            const order = await Order.findOne({
                user: req.user.id,
                portfolio: req.portfolio.id,
                ticker: req.body.ticker,
                direction: req.body.direction,
                executePrice: price,
                numUnits: units,
                executed: false,
            });
            
            if (!order) {
                throw new Error("This order doesn't exist");
            }

            if (req.body.direction === Direction.Buy) {
                req.user.availableBalance += price * units;
            } else {
                const stock = await Stock.findOne({
                    portfolio: req.portfolio.id,
                    ticker: req.body.ticker
                });

                if (!stock) {
                    throw new Error("Cant access a stock that doesnt exist");
                }

                stock.numUnits += units;
                await stock.save();
            }
            await order.delete();

            req.user.numOrders--;
            await req.user.save();

            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            console.log(e);
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static buyMarketOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            const response = await axios.get(
                `https://finnhub.io/api/v1/quote?symbol=${req.body.ticker}&token=c5vln0iad3ibtqnna830`);
            const units = parseFloat(req.body.units);
            const totalCost = response.data.c * units;
            const marketPrice = response.data.c;
            if (req.user.availableBalance - totalCost < 0) {
                throw new Error('Available Balance too low to purchase stocks');
            }
            const existingStock = await Stock.findOne({
                portfolio: req.portfolio.id,
                ticker: req.body.ticker
            });

            if (!existingStock) {

                const stock = new Stock({
                    portfolio: req.portfolio.id,
                    ticker: req.body.ticker,
                    name: req.body.name,
                    averagePrice: marketPrice,
                    numUnits: units
                });

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
                portfolio: req.portfolio.id,
                numUnits: units,
                executePrice: marketPrice,
                ticker: req.body.ticker,
                name: req.body.name,
                executed: true,
                direction: "BUY"
            });
            if (!order) {
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
            const existingStock = await Stock.findOne({
                portfolio: req.portfolio.id,
                ticker: req.body.ticker
            });
            if (!existingStock) {
                throw new Error('This stock doesnt exist');
            }

            const response = await axios.get(
                `https://finnhub.io/api/v1/quote?symbol=${req.body.ticker}&token=c5vln0iad3ibtqnna830`);
            const units = parseFloat(req.body.units);
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
                portfolio: req.portfolio.id,
                numUnits: units,
                executePrice: marketPrice,
                ticker: req.body.ticker,
                name: req.body.name,
                executed: true,
                direction: "SELL"
            });
            if (!order) {
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