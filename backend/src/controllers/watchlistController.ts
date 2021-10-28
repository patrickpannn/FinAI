import { Request, Response } from 'express';
import Watchlist from '../models/watchlistModel';

export default class WatchListController {
    public static add = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if(Object.keys(req.body).length !== 1 || !req.body.ticker)
            {
                throw new Error("Stock ticker was not specified");
            }
            const watchlist = await Watchlist.findOne({ user: req.user.id });
            if(!watchlist)
            {
                throw new Error('Watchlist does not exist'); 
            }
            watchlist.tickers.push({ ticker: req.body.ticker });
            await watchlist.save();
            res.status(200).json( { response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}