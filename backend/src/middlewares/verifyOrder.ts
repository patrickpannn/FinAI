import { Request, Response, NextFunction } from 'express';
import Portfolio from '../models/portfolioModel';

// the items found inside a stock json request
const stockBody = [
    'name',
    'ticker',
    'portfolio',
    'units'
];

// the items found inside an order json request
const orderBody = [
    'direction',
    'units',
    'name',
    'ticker',
    'setPrice',
    'portfolio'
];

// the directions which a limit order are allowed to have
enum Direction {
    Sell = "SELL",
    Buy = "BUY",
}

// Due to our use of API's, we can only allow bitcoin and ethereum
// to have Limit Order functionality
enum PossibleOrders {
    bitcoin = "BINANCE:BTCUSDT",
    ethereum = "BINANCE:ETHUSDT"
};

// class to verify that a stockOrder or LimitOrder is
// of the correct format. This middleware will reduce the
// duplicate code potentially found in all orderController routes
class VerifyOrder {

    // verify that a limit order is of the correct format and
    // the specified portfolio exists for a given user
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

    // verify that we are given a single item in our request,
    // being the order ID
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

    // verify that the marketOrder is of the correct format and that
    // the specified user has the given portfolio
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
