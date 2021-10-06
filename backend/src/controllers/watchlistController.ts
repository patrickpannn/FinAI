import { Request, Response } from 'express';
import Watchlist from '../models/watchlistModel';
import User from '../models/userModel';

export default class WatchListController {
    public static append = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const watchlistItem = new Watchlist(req.body);
            const userExists = await User.exists({ email: watchlistItem.email });
            if(userExists){
                const token: string = watchlistItem.generateAuth();
                watchlistItem.tokens.push({ token });
                await watchlistItem.save();
                res.status(201).json({token});
            } else {
                res.status(400).json({ error: 'Bad Request'});
            }
        } catch (e) {
            res.status(400).json({ error: 'Bad Request'});
        }
    };
}