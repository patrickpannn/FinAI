import { Request, Response } from 'express';
import User from '../models/userModel';
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

            if (!user) {
                res.sendStatus(400);
            } else if (await bcrypt.compare(req.body.password, user.password)) {
                const token: string = user.generateAuth();
                user.tokens.push({ token });
                await User.findOneAndUpdate({ email: inputEmail }, user);
                res.status(200).json({ token });
            } else {
                res.sendStatus(400);
            }

        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });
        }
    };
}