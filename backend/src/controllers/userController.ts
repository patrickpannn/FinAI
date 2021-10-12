import { Request, Response } from 'express';
import User from '../models/userModel';
import Portfolio from '../models/portfolioModel';
import bcrypt from 'bcryptjs';

export default class UserController {
    public static signup = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const user = new User(req.body);
            const token: string = user.generateAuth();
            user.tokens.push({ token });
            user.balance = 0;
            await user.save();

            const portfolio = new Portfolio({ user: user.id, name: "Default" });
            await portfolio.save();

            res.status(201).json({ token });
        } catch (e) {
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
}