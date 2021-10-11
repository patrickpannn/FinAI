import { Request, Response } from 'express';
import Watchlist from '../models/watchlistModel';

export default class WatchListController {
    public static add = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const watchlist = await Watchlist.findOne({ user: req.user._id });
            watchlist.tickers.push({ ticker: req.body.ticker });
            res.sendStatus(201);
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}