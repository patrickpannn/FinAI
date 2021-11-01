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

enum orderBody {
    direction = "direction",
    units = "units",
    name = "name",
    ticker = "ticker",
    setPrice = "setPrice",
    portfolio = "portfolio"
}

enum stockBody {
    name = "name",
    ticker = "ticker",
    portfolio = "portfolio",
    units = "units"
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
            for(var parameter in orderBody)
            {
                if(!Object.keys(req.body).includes(parameter)){
                    throw new Error("Bad Request");
                }
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
                //console.log(Object.keys(req.body).length);
                throw new Error('Invalid input');
            } 
            for(var parameter in stockBody)
            {
                if(!Object.keys(req.body).includes(parameter)){
                    throw new Error("Bad Request");
                }
            }
            const portfolio = await Portfolio.findOne({ user: req.user.id, name : req.body.portfolio });
            if(!portfolio)
            {
                throw new Error('Portfolio specified doesn\'t exist');
            }
            next();
        } catch (e) {
                console.log(e);
                res.status(401).json({ error: 'Order is incorrect' });
        };
    };
}

export default VerifyOrder;