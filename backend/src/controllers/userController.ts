import { Request, Response } from 'express';
import Watchlist from '../models/watchlistModel';
import User from      '../models/userModel';
import bcrypt from 'bcryptjs';
import Order from '../models/orderModel';

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
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const token = req.token; 
            const tokens = req.user.tokens; 
            const stringTokens = tokens.map(String);       
            const index = stringTokens.indexOf(token);
            req.user.tokens.splice(index, 1);
            req.user.save();
            res.status(400).json({ response: "Successfully logged out" });
        } catch(e) {
            console.log(e);
            res.status(400).json({ error: 'Bad Request.' });
        }
    };

    public static login = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const inputEmail = req.body.email;
            const user = await User.findOne({ email: inputEmail });

            if (!user || 
                !(await bcrypt.compare(req.body.password, user.password))) {
                res.status(400).json({ error: 'Bad Request.' });
            } else {
                const token: string = user.generateAuth();
                user.tokens.push({ token });
                await user.save();
                res.status(200).json({ token });
            }

        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });
        }
    };

    public static delete_account = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            await User.findOneAndDelete({ _id: req.user._id });
            await Watchlist.findOneAndDelete({ user: req.user.id });
            await Order.remove({ user: req.user.id });
            res.status(201).json( "User was deleted" );
        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });
        }
    }
}