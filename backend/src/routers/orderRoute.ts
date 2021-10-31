import express, { Router } from 'express';
import OrderController from '../controllers/orderController';
import Route from '../interfaces/routeInterface';
import UserAuthentication from '../middlewares/authentication';
import VerifyOrder from '../middlewares/verifyOrder';

export default class OrderRoute implements Route {

    private path: string = 'user/order';

    private router: Router = express.Router();

    constructor () {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/buyLimitOrder`, UserAuthentication.auth, VerifyOrder.verify, OrderController.buyLimitOrder);
        this.router.post(`${this.path}/sellLimitOrder`, UserAuthentication.auth, VerifyOrder.verify, OrderController.sellLimitOrder);
        this.router.post(`${this.path}/buyMarketOrder`, UserAuthentication.auth, VerifyOrder.verify, OrderController.buyMarketOrder);
        this.router.post(`${this.path}/sellMarketOrder`, UserAuthentication.auth, VerifyOrder.verify, OrderController.sellMarketOrder);
        this.router.post(`${this.path}/cancelBuyLimitOrder`, UserAuthentication.auth, VerifyOrder.verify, OrderController.cancelBuyLimitOrder);
        this.router.post(`${this.path}/cancelSellLimitOrder`, UserAuthentication.auth, VerifyOrder.verify, OrderController.cancelSellLimitOrder);
    }

    public getRouter(): Router {
        return this.router;
    }
}