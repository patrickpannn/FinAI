import { Request, Response } from 'express';
import Watchlist from '../models/watchlistModel';

export default class WatchListController {
    public static add = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const watchlistItem = new Watchlist(
                { user: 
                    req.user._id, 
                    ...req.body 
                }); //TODO
            await watchlistItem.save();
            res.sendStatus(201);
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}