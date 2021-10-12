import { Request, Response } from 'express';
import Order from '../models/orderModel';
import { RequestUser } from '../interfaces/requestUser';

export default class OrderController {
    public static add = async (
        req: RequestUser,
        res: Response
    ): Promise<void> => {
        try {
            const order = new Order({ user: req.user?.id, ...req.body });
            if (!order)
            {
                throw new Error('Could not create order');
            }
            await order.save();
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}