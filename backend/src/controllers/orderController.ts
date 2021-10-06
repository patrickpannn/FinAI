import { Request, Response } from 'express';
import Order from '../models/orderModel';
import User from '../models/userModel';

export default class WatchListController {
    public static add = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const order = new Order(req.body);
            const userExists = await User.exists({ email: order.email });
            if(userExists){
                const token: string = order.generateAuth();
                order.tokens.push({ token });
                await order.save();
                res.status(201).json({token});
            } else {
                res.status(400).json({ error: 'Bad Request'});
            }
        } catch (e) {
            res.status(400).json({ error: 'Bad Request'});
        }
    };
}