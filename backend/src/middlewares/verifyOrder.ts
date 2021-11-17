import { Request, Response, NextFunction } from 'express';
import Portfolio from '../models/portfolioModel';
import Order from '../models/orderModel';

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

enum Direction {
    Sell = "SELL",
    Buy = "BUY",
}

enum PossibleOrders {
    bitcoin = "BINANCE:BTCUSDT",
    ethereum = "BINANCE:ETHUSDT"
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
            
            if (req.body.direction !== Direction.Buy
                && req.body.direction !== Direction.Sell) {
                throw new Error('Bad Request');
            }

            if(req.body.ticker !== PossibleOrders.bitcoin 
                && req.body.ticker !== PossibleOrders.ethereum)
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
            res.status(403).json({ error: 'Order is incorrect' });
        };
    };

        public static async verifyCancelOrder(
            req: Request,
            res: Response,
            next: NextFunction
    ): Promise<void> {
        try {
            if(Object.keys(req.body).length !== 1 || !req.body.id)
            {
                throw new Error('Invalid input');
            }

            next();
        } catch (e) {
            res.status(400).json({ error: 'Order is incorrect' });
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