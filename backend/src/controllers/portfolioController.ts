import { Request, Response } from 'express';
import Portfolio from '../models/portfolioModel';

export default class PortfolioController {
    public static create = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            if (!req.body.name) {
                throw new Error('Could not create portfolio');
            }

            const portfolio = new Portfolio({ 
                user: req.user._id, name: req.body.name });

            if (!portfolio) {
                throw new Error('Could not create portfolio');
            }

            await portfolio.save();
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Portfolio Bad Request' });
        }
    };

} 