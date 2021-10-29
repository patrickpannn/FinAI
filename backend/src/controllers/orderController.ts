import { Request, Response } from 'express';
import Order from '../models/orderModel';
import Portfolio from '../models/portfolioModel';
import Stock from '../models/stockModel';
import Order from '../models/orderModel'

export default class OrderController {
    public static create = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            if(Object.keys(req.body).length !== 3)
            {
                throw new Error('Invalid input');
            }
            if(!req.body.units)
            {
                throw new Error("You must input a purchase quantity for the order");
            }
            if(!req.body.ticker)
            {
                throw new Error("You must choose a specific stock for this order");
            }
            const portfolio = await Portfolio.findOne({ user: req.user.id, name: req.body.name });
            if(!portfolio)
            {
                throw new Error("Cannot access portfolio");
            }
            const stock = await Stock.findOne({ portfolio: portfolio.id });
            if(!stock)
            {
                throw new Error("Cannot access stock");
            }
            

            if(req.body.direction == "SELLING")
            {
               if(stock.numUnits - req.body.units < 0)
               {
                   throw new Error("You must specify a valid quantity to sell");
               } 
               
            } else if (req.body.direction == "BUYING")
            {
 
            } else 
            {
                throw new Error("You must specify if the stock is being bought or sold"); 
            }



            //const order = new Order({ user: req.user.id, ...req.body });
            await order.save();
            res.status(201).json({ response: 'Successful' });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}