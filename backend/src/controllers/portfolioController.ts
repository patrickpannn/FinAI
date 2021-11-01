import { Request, Response } from 'express';
import Portfolio from '../models/portfolioModel';
import Stock from '../models/stockModel';

//export type StockObject = { ticker: string, averagePrice: number, numUnits: number };
//export type PortfolioList = { name: string, stocks: Array<StockObject> };
interface Stock {
    ticker: string,
    averagePrice: number,
    numUnits: number
};


export default class PortfolioController {
    public static create = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            if (!Object.keys(req.body).length) {
                throw new Error('No portfolio name given.');
            }

            const allowedFields = ['name'];

            for (let key in req.body) {
                if (!allowedFields.includes(key)) {
                    throw new Error('More fields than required are provided.');
                }
            }

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

    public static list = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            if (Object.keys(req.body).length) {
                throw new Error('Inputs are given but not needed.');
            }

            const portfolios = await Portfolio.find({ user: req.user._id });

            if (!portfolios.length) {
                throw new Error('User has no portfolios');
            }

            let list = [];

            for (let i = 0; i < portfolios.length; i++) {
                let stockList: Stock[] = [];
                let portfolioInfo = { name: portfolios[i].name,
                                      stocks: stockList };

                let stocks = await Stock.find({ portfolio: portfolios[i]._id });

                for (let j = 0; j < stocks.length; j++) {
                    let stockObj = {
                        ticker: stocks[j].ticker,
                        averagePrice: stocks[j].averagePrice,
                        numUnits: stocks[j].numUnits
                    };
                    portfolioInfo.stocks.push(stockObj);
                };
                list.push(portfolioInfo);
            }

            res.status(200).send(list);
        } catch (e) {
            res.status(400).json({ error: 'List of Portfolios Bad Request' });
        }
    };

} 