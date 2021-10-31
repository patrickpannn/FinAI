import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

enum Direction {
    Sell= "SELL",
    Buy= "BUY",
  }

class VerifyOrder {

    public static async verify(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(Object.keys(req.body).length !== 5)
            {
                throw new Error('Invalid input');
            } 
            if(!req.body.units)
            {
                throw new Error('You must specify an order quantity');
            }
            if(req.body.name)
            {
                throw new Error('You must specify a stock name for the order');
            }
            if(req.body.ticker)
            {
                throw new Error('You must specify the stock to order');
            }
            if(req.body.marketPrice)
            {
                throw new Error('The market price must be specified');
            }
            if(req.body.direction)
            {
                throw new Error('You must specify if this order is to purchase or sell a stock');
            }
            if(!Object.values(Direction).includes(req.body.direction))
            {
                throw new Error('Invalid direction provided');
            }
            next();
        } catch (e) {
            res.status(401).json({ error: 'Could not verify order' });
        }
    }
}

export default VerifyOrder;