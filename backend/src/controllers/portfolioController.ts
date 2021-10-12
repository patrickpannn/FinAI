import { Response } from 'express';
import Portfolio from '../models/portfolioModel';
import { RequestUser } from '../interfaces/requestUser';

export default class PortfolioController {
    public static create = async (
        req: RequestUser,
        res: Response
    ): Promise<void> => {
        try {

            const portfolio = new Portfolio({ user: req.user.id, ...req.body });

            if (!portfolio) {
                throw new Error('Could not create order');
            }
            await portfolio.save();

            res.status(201).json({ response: 'Successful' });

        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

} 