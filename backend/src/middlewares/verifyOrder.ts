import { Request, Response, NextFunction } from 'express';
import Portfolio from '../models/portfolioModel';

const stockBody = [
    'name',
    'ticker',
    'portfolio',
    'units'
];

const orderBody = [
    'direction',
    'units',
    'name',
    'ticker',
    'setPrice',
    'portfolio'
];

enum possibleOrders {
    bitcoin = "BINANCE:BTCUSDT",
    etherium = "BINANCE:ETHUSDT"
};

class VerifyOrder {

    public static async verifyLimitOrder(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if(Object.keys(req.body).length !== 6)
            {
                throw new Error('Invalid input');
            } 

            for (let key in req.body) {
                if (!orderBody.includes(key)) {
                    throw new Error('Bad Request');
                }
            }

            if(req.body.ticker !== possibleOrders.bitcoin && req.body.ticker !== possibleOrders.etherium)
            {
                throw new Error('Bad Request');
            }

            const portfolio = await Portfolio.findOne({
                user: req.user.id,
                name: req.body.portfolio
            });
            if(!portfolio)
            {
                throw new Error('Could not find portfolio');
            }
            req.portfolio = portfolio;

            next();
        } catch (e) {
            res.status(401).json({ error: 'Order is incorrect' });
        };
    };

    public static async verifyMarketOrder(
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
                user: req.user.id,
                name: req.body.portfolio
            });
            if(!portfolio)
            {
                throw new Error('Could not find portfolio');
            }
            req.portfolio = portfolio;

            next();
        } catch (e) {
            res.status(400).json({ error: 'Order is incorrect' });
        };
    };
}

export default VerifyOrder;