import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const accessKey: string = process.env.ACCESS_KEY || 'ezfinance111';

export default class VerifyUser {

    public static async verifyUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.body.email || !validator.isEmail(req.body.email)) {
                throw new Error("Invalid Input");
            }
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                throw new Error("Not Found");
            }
            req.user = user;
            next();
        } catch (e) {
            res.status(404).json({ error: "Not Found" });
        }

    }

    public static async verifyResetToken(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const token = req.headers.authorization?.split('Bearer ')[1];
            if (!token) {
                throw new Error('Bad Request');
            }
            const userId = jwt.verify(token, accessKey);
            const user = await User.findOne({
                user: userId,
                resetToken: token
            });
            if (!user) { 
                throw new Error('Bad Request');
            }

            req.user = user;
            next();
        } catch (e) {
            res.status(401).json({ error: 'Invalid Token' });
        }
    }
}
