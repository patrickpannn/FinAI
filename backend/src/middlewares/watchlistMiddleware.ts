import { Request, Response, NextFunction } from 'express';
import Watchlist from '../models/watchlistModel';

export default class WatchlistMiddleware {

    public static async checkInputTickers(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (Object.keys(req.body).length !== 1 || !req.body.ticker) {
                throw new Error('Stock ticker was not specified');
            }

            const watchlist = await Watchlist.findOne({ user: req.user._id });
            if (!watchlist) {
                throw new Error('Watchlist not found');
            }

            req.watchlist = watchlist;
            next();
        } catch (e) {
            res.status(400).json({ error: "Bad Request" });
        }

    }

}
