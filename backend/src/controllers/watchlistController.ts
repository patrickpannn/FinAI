import { Request, Response } from 'express';
import Watchlist, { Ticker } from '../models/watchlistModel';

export default class WatchListController {
    public static list = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if (Object.keys(req.body).length) {
                throw new Error('Inputs are given but not needed.');
            }

            const watchlist = await Watchlist.findOne({ user: req.user._id });

            if (!watchlist) {
                throw new Error('Watchlist not found');
            }

            let tickerList: Ticker[] = [];

            for (let i = 0; i < watchlist.tickers.length; i++) {
                let tickerObj = { ticker: watchlist.tickers[i].ticker,
                                  stockName: watchlist.tickers[i].stockName };
                tickerList.push(tickerObj);
            }

            res.status(200).json(tickerList);
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static addTicker = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { ticker, stockName } = req.params;
            const watchlist = await Watchlist.findOne({ user: req.user._id });
            if (!watchlist) {
                throw new Error('Watchlist not found');
            }

            const tickers = watchlist.tickers;
            if (!tickers.every((t: Ticker) => {
                return t.ticker !== ticker.toUpperCase()
                    && t.stockName !== stockName;
            })
            ) {
                throw new Error('Duplicate tickers');
            }

            tickers.splice(0, 0, {
                ticker: ticker.toUpperCase(),
                stockName: stockName
            });
            await watchlist.save();

            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };

    public static removeTicker = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const ticker = req.params.ticker;
            const watchlist = await Watchlist.findOne({ user: req.user._id });
            if (!watchlist) {
                throw new Error('Watchlist not found');
            }

            let isTickers = false;
            watchlist.tickers = watchlist.tickers.filter((t: Ticker) => {
                if (t.ticker === ticker) isTickers = true;
                return t.ticker !== ticker;
            });

            if (!isTickers) {
                throw new Error('No such ticker');
            }
            await watchlist.save();
            res.status(200).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}