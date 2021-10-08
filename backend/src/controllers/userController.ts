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
            // Unsure how to reference email or password
            const inputEmail = req.body.email; 
            const inputPassword = await bcrypt.hash(req.body.password, 10);

            const query = User.findOne({
                email: inputEmail,
                password: inputPassword
            });
            const user = await query.exec();

            if (!user) {
                res.status(403).json({ error: 'Incorrect Email or Password' });
            } else {
               const token: string = user.generateAuth();
               user.tokens.push({ token });
               await User.findOneAndUpdate({ email: inputEmail }, user);
               res.status(201).json({ token });
            }

        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });
        }
    };
}