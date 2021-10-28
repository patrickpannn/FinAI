import { Request, Response } from 'express';
import { Ticker } from '../models/watchlistModel';

export default class WatchListController {
    public static add = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const tickers = req.watchlist.tickers;
            if (!tickers.every(
                (t: Ticker) => t.ticker !== req.body.ticker.toUpperCase())
            ) {
                throw new Error('Duplicate tickers');
            }

            tickers.push({ ticker: req.body.ticker.toUpperCase() });
            await req.watchlist.save();

            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static removeTicker = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            let isTicker = false;
            const watchlist = req.watchlist;

            watchlist.tickers = watchlist.tickers.filter((t: Ticker) => {
                if (t.ticker === req.body.ticker) isTicker = true;
                return t.ticker !== req.body.ticker;
            });

            if (!isTicker) {
                throw new Error('No such ticker');
            }
            await watchlist.save();
            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}