import { Request, Response } from 'express';
import User from '../models/userModel';
import Portfolio from '../models/portfolioModel';
import Order from '../models/orderModel';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import EmailService from '../services/emailService';
import ResetCode from '../models/resetCodeModel';
import Watchlist from '../models/watchlistModel';
import dotenv from 'dotenv';
dotenv.config();

const provider = process.env.PROVIDER || 'gmail';
const email = process.env.FROMEMAIL || '404.Not.Found.3900@gmail.com';
const password = process.env.FROMPASSWORD || '404isnotfound';

/*
    Class UserController has several handlers to handle different endpoint requests
    i.e. signup, login, sendCode, verifyCode, resetPassword, updateProfile
*/
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
            const watchlist = new Watchlist({ user: user.id });
            await watchlist.save();
            const portfolio = new Portfolio({ user: user.id, name: "Default" });
            await portfolio.save();

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
            await req.user.save();

            res.status(200).json({ response: "Successfully logged out" });
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

    public static getProfile = (
        req: Request,
        res: Response
    ): void => {
        res.status(200).json({
            username: req.user.username,
            balance: req.user.balance
        });
    };

    public static updateProfile = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            if (!Object.keys(req.body).length) {
                throw new Error('No fields to update.');
            }

            const allowedFields = ['password', 'username'];

            for (let key in req.body) {
                if (!allowedFields.includes(key)) {
                    throw new Error('Attempting to change invalid field.');
                }
            }

            if (req.body.password) {
                if (!(await bcrypt.compare(
                    req.body.password,
                    req.user.password)
                )) {
                    req.user.password = req.body.password;
                    req.user.tokens = [];
                } else {
                    throw new Error('New password cannot be the same as old password.');
                }
            }
            if (req.body.username) {
                req.user.username = req.body.username;
            }

            await req.user.save();
            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });
        }
    };

    public static sendCode = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if (Object.keys(req.body).length !== 1) {
                throw new Error('Invalid Input');
            }
            const code = crypto.randomBytes(3).toString("hex");
            await ResetCode.findOneAndDelete({ user: req.user._id });

            const resetCode = new ResetCode({
                user: req.user._id,
                code: code
            });
            await resetCode.save();
            await EmailService.sendMail(provider, email, password,
                req.body.email, code);
            res.status(200).json({ response: "Email was sent" });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });
        }
    };

    public static verifyCode = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if (Object.keys(req.body).length !== 2 || !req.body.code) {
                throw new Error('Invalid Input');
            }
            const resetCode = await ResetCode.findOne({
                user: req.user._id,
                code: req.body.code
            });
            if (!resetCode) {
                throw new Error('Invalid Code.');
            }
            const token = req.user.generateAuth();
            req.user.resetToken = token;

            await req.user.save();
            await resetCode.remove();
            res.status(200).json({ resetToken: token });

        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });

        }
    };

    public static resetPassword = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if (Object.keys(req.body).length !== 1 || !req.body.password) {
                throw new Error('Invalid Input');
            }
            req.user.password = req.body.password;
            req.user.resetToken = '';
            req.user.tokens = [];

            await req.user.save();
            res.status(200).json({ response: 'Success' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static changeBalance = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if (!req.body.value) {
                throw new Error(" You must input a specified amount to add or remove");
            }
            req.user.changeBalance(req.body.value);
            await req.user.save();
            res.status(200).json({ response: "Balance updated!" });

        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });
        }
    };

    public static getBalance = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if (Object.keys(req.body).length) {
                throw new Error('Inputs are given but not needed.');
            }

            res.status(200).json({
                balance: req.user.balance,
                availableBalance: req.user.availableBalance
            });

        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });
        }
    };

    public static deleteAccount = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if (Object.keys(req.body).length) {
                throw new Error('Inputs are given but not needed.');
            }

            await User.findOneAndDelete({ _id: req.user._id });
            await Watchlist.findOneAndDelete({ user: req.user.id });
            await Order.remove({ user: req.user.id });
            
            const portfolios = await Portfolio.find({ 
                user: req.user.id, name: { $ne: "Default" } });

            for (let i = 0; i < portfolios.length; i++) {
                await portfolios[i].deleteOne();
            }

            const defaultPortfolio = await Portfolio.findOne({ 
                user: req.user.id, name: "Default" });

            if (!defaultPortfolio) {
                throw new Error('Could not delete portfolio');
            }

            await defaultPortfolio.deleteOne();

            res.status(200).json({ response: "User Deleted" });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request.' });
        }
    };

}