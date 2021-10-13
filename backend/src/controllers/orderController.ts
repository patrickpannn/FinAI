import { Request, Response } from 'express';
import Order from '../models/orderModel';
//import { RequestUser } from '../interfaces/requestUser';

export default class OrderController {
    public static add = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const order = new Order({ user: req.user.id, ...req.body });
            await order.save();
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}