import { Request, Response, NextFunction } from 'express';
import Portfolio from '../models/portfolioModel';

const stockBody = [
    'name',
    'ticker',
    'portfolio',
    'units'
];

class VerifyOrder {

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

            for (let key in req.body) {
                if (!stockBody.includes(key)) {
                    throw new Error('Bad Request');
                }
            }

            if(req.body.units <= 0)
            {
                throw new Error('Must specify a positive order of stocks');
            }
            const portfolio = await Portfolio.findOne({ 
                user: req.user.id, name : req.body.portfolio });
            if(!portfolio)
            {
                throw new Error('Portfolio specified doesn\'t exist');
            }
            next();
        } catch (e) {
                console.log(e);
                res.status(400).json({ error: 'Order is incorrect' });
        };
    };
}

export default VerifyOrder;