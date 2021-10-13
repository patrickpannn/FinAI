import { Response, NextFunction, Request } from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const accessKey: string = process.env.ACCESS_KEY || 'ezfinance111';

class UserAuthentication {

    public static async auth(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const token: string | undefined = req.headers.authorization?.split('Bearer ')[1];
            if (!token) {
                throw new Error('Authentication failed.');
            }

            const userId = jwt.verify(token, accessKey);
            const user = await User.findOne({ _id: userId, 'tokens.token': token });
            if (!user) {
                throw new Error('Authentication failed.');
            }
            req.token = token;
            req.user = user;
            next();
        } catch (e) {
            res.status(401).json({ error: 'Authentication failed.' });
        }

    }
}

export default UserAuthentication;