import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import User from '../models/userModel';
import Portfolio from '../models/portfolioModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

enum Direction {
    Sell= "SELL",
    Buy= "BUY",
}

class VerifyOrder {

    public static async verifyOrder(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(Object.keys(req.body).length !== 6)
            {
                throw new Error('Invalid input');
            } 
            if(!req.body.units)
            {
                throw new Error('You must specify an order quantity');
            }
            if(req.body.units <= 0)
            {
                throw new Error('You units ordered must be positive');
            }
            if(!req.body.name)
            {
                throw new Error('You must specify a stock name for the order');
            }
            if(!req.body.ticker)
            {
                throw new Error('You must specify the stock to order');
            }
            if(!req.body.setPrice)
            {
                throw new Error('The market price must be specified');
            }
            if(req.body.setPrice <= 0)
            {
                throw new Error('The market price must be a positive');
            }
            if(!req.body.direction)
            {
                throw new Error('You must specify if this order is to purchase or sell a stock');
            }
            if(!req.body.portfolio)
            {
                throw new Error('You must specify a portfolio to add the executed order to');
            }
            const portfolio = await Portfolio.findOne({ user: req.user.id, name : req.body.portfolio });
            if(!portfolio)
            {
                throw new Error('Portfolio specified doesn\'t exist');
            }
            if(!Object.values(Direction).includes(req.body.direction))
            {
                throw new Error('Invalid direction provided');
            }
            next();
        } catch (e) {
            console.log(e);
            res.status(401).json({ error: 'Order is incorrect' });
        };
    };

    public static async verifyStock(
            req: Request,
            res: Response,
            next: NextFunction
    ): Promise<void> {
        try {
            if(Object.keys(req.body).length !== 4)
            {
                throw new Error('Invalid input');
            } 
            if(!req.body.units)
            {
                throw new Error('You must specify an order quantity');
            }
            if(req.body.units <= 0)
            {
                throw new Error('You units ordered must be positive');
            }
            if(!req.body.name)
            {
                throw new Error('You must specify a stock name for the order');
            }
            if(!req.body.ticker)
            {
                throw new Error('You must specify the stock to order');
            }
            if(!req.body.setPrice)
            {
                throw new Error('The market price must be specified');
            }
            if(req.body.setPrice <= 0)
            {
                throw new Error('The market price must be a positive');
            }
            if(!req.body.direction)
            {
                throw new Error('You must specify if this order is to purchase or sell a stock');
            }
            if(!req.body.portfolio)
            {
                throw new Error('You must specify a portfolio to add the executed order to');
            }
            const portfolio = await Portfolio.findOne({ user: req.user.id, name : req.body.portfolio });
            if(!portfolio)
            {
                throw new Error('Portfolio specified doesn\'t exist');
            }
            if(!Object.values(Direction).includes(req.body.direction))
            {
                throw new Error('Invalid direction provided');
            }
            next();
        } catch (e) {
                console.log(e);
                res.status(401).json({ error: 'Order is incorrect' });
        };
    };
}

export default VerifyOrder;