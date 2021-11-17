import express, { Router } from 'express';
import OrderController from '../controllers/orderController';
import Route from '../interfaces/routeInterface';
import UserAuthentication from '../middlewares/authentication';
import VerifyOrder from '../middlewares/verifyOrder';

export default class OrderRoute implements Route {

    private path: string = '/user/order';

    private router: Router = express.Router();

    constructor () {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(`${this.path}`, UserAuthentication.auth, OrderController.list);
        this.router.post(`${this.path}/buyMarketOrder`, UserAuthentication.auth, VerifyOrder.verifyMarketOrder, OrderController.buyMarketOrder);
        this.router.post(`${this.path}/sellMarketOrder`, UserAuthentication.auth, VerifyOrder.verifyMarketOrder, OrderController.sellMarketOrder);
        this.router.post(`${this.path}/buyLimitOrder`, UserAuthentication.auth, VerifyOrder.verifyLimitOrder, OrderController.buyLimitOrder);
        this.router.post(`${this.path}/sellLimitOrder`, UserAuthentication.auth, VerifyOrder.verifyLimitOrder, OrderController.sellLimitOrder);
        this.router.delete(`${this.path}/cancelOrder`, UserAuthentication.auth, VerifyOrder.verifyCancelOrder, OrderController.cancelOrder);
    }

    public getRouter(): Router {
        return this.router;
    }
}