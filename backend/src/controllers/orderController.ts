import { Request, Response } from 'express';
import Order from '../models/orderModel';

export default class OrderController {
    public static add = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const order = new Order({ user: req.user._id, ...req.body }); //TODO
            await order.save();
            res.sendStatus(201);
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}