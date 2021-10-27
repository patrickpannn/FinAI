import { Request, Response } from 'express';
import Order from '../models/orderModel';

export default class OrderController {
    public static add = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if(Object.keys(req.body).length !== 3)
            {
                throw new Error('Invalid input');
            }
            if(!req.body.purchase_price)
            {
                throw new Error("You must input a purchase price for the order");
            }
            if(!req.body.purchase_quantity)
            {
                throw new Error("You must input a purchase quantity for the order");
            }
            if(!req.body.ticker)
            {
                throw new Error("You must choose a specific stock for this order");
            }
            if(req.body.direction == "SELL" || req.body.direction == "BUY")
            {
            } else
            {
                throw new Error("")
            }

            const order = new Order({ user: req.user.id, ...req.body });
            await order.save();
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}