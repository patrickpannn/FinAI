import { Request, Response } from 'express';
import Watchlist from '../models/watchlistModel';
import User from      '../models/userModel';
import { RequestUser } from '../interfaces/requestUser';

type Token = { token: string };

export default class UserController {
    public static signup = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const user = new User(req.body);
            const watchlist = new Watchlist({ user: user.id });
            const token: string = user.generateAuth();
            user.tokens.push({ token });
            user.balance = 0;
            await user.save();
            await watchlist.save();

            res.status(201).json({ token });
        } catch (e) {
            console.log(e);
            res.status(400).json({ error: 'Bad Request.' });
        }
    };
    public static logout = async (
        req: RequestUser,
        res: Response
    ): Promise<void> => {
        try {
            const token = req.token; 
            if(!token){
                throw new Error("Logout failed");
            }
            const tokens = req.user?.tokens; 
            if(!tokens){
                throw new Error("Logout failed");
            }
            const stringTokens = tokens.map(String);       
            const index = stringTokens.indexOf(token);
            req.user?.tokens.splice(index, 1);
            req.user?.save();
            res.status(400).json({ response: "Successfully logged out"});
        } catch(e) {
            console.log(e);
            res.status(400).json({ error: 'Bad Request.' });
        }
    };
}