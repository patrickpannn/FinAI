import { Request, Response } from 'express';
import Watchlist from '../models/watchlistModel';
import { RequestUser } from '../interfaces/requestUser';

export default class WatchListController {
    public static add = async (
        req: RequestUser,
        res: Response
    ): Promise<void> => {
        try {
            const watchlist = await Watchlist.findOne({ user: req.user?.id });
            if(!watchlist)
            {
                throw new Error('Watchlist does not exist'); 
            }
            if(!req.body.ticker)
            {
                throw new Error('Ticker not given');
            }
            watchlist.tickers.push({ ticker: req.body.ticker });
            await watchlist.save();
            res.status(201).json( { response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}