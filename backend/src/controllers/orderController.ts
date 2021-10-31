import { Request, Response } from 'express';
import Order from '../models/orderModel';
import Portfolio from '../models/portfolioModel';
import Stock from '../models/stockModel';

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
           const order = new Order({ user: req.body.user, numUnits: req.body.units, ticker: req.body.ticker,
                                     name: req.body.name, direction: req.body.direction });
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
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static buyMarketOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
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

    public static cancelBuyLimitOrder = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static cancelSellLimitOrder = async (
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