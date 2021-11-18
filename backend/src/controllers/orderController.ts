import { Request, Response } from 'express';
import Order from '../models/orderModel';
import Portfolio from '../models/portfolioModel';
import Stock from '../models/stockModel';
import axios from 'axios';

enum Direction {
    Sell = "SELL",
    Buy = "BUY",
}

// The order controller handles all backend functionality to process
// both market orders and limit orders (instantaneous and delayed orders)
// Stocks/crypto can be bought and sold instantaneously or
// crypto can be placed under a limit order.
export default class OrderController {
    // List out all orders that a specified user owns
    // Order Model returns an order object which will be added to a list
    // and sent to the frontend to parse
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

    // Purchase a Limit Order
    // The user cannot have more than 10 limit orders at a time
    // The direction provided  must also be "BUY" which is stored in the document
    // Once a buy Limit Order is allowable, the number of orders a user has
    // will increase. The available Balance of the user will also decrease.
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
                isLimitOrder: true,
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

    // Sell Limit Order method
    // For when a user wants to sell a stock at a specified price and quantity
    // We check the order format and also if a stock exists to sell in
    // one of our portfolios. If it does, we decrement by the stock quantity specified
    // and increment the number of user limit orders
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
                isLimitOrder: true,
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

    // Cancel a Limit Order
    // Check if the order has been executed already (not allowed)
    // If it was a sell order we were cancelling, we want to add the 
    // stock quantity set aside for selling back to the stock item itself.
    // If it was a buy order we want to add the balance
    // set aside for purchasing the stock back to the users available Balance.
    // Once done, reduce the number of orders owned by the user.
    public static cancelOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            const order = await Order.findById(
                req.body.id
            );
            if (!order) {
                throw new Error("This order doesn't exist");
            }
            
            if(order.executed === true)
            {
                throw new Error("Cannot cancel an executed order");
            }

            const units = order.numUnits;
            const price = order.executePrice;

            const portfolio = await Portfolio.findOne({
                id: order.portfolio
            });
            if(!portfolio)
            {
                throw new Error('Could not find portfolio');
            }

            if (order.direction === Direction.Buy) {
                req.user.availableBalance += price * units;
            } else {
                const stock = await Stock.findOne({
                    portfolio: portfolio.id,
                    ticker: order.ticker
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
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    // Purchase a stock at the market price (instantaneous).
    // fetch API data for the stock price, the total price
    // is the stock price * the quantity.
    // We check if the user balance is high enough.
    // If we already own the stock, we need to add the units to the
    // existing stock item, otherwise we make a new stock.
    // An executed order will be left to show we successfully purchased
    // this stock.
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
                isLimitOrder: false,
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

    // Sell an owned stock at the market price level.
    // We must own the stock and have the quantity to sell.
    // Once sold we can remove the stocks from our portfolio and
    // add the value back to our user balance.
    // An order is left to show we successfully sold our stocks.
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
                isLimitOrder: false,
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
