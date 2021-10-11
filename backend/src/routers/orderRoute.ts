import express, { Router } from 'express';
import OrderController from '../controllers/orderController';
import Route from '../interfaces/routeInterface';

export default class OrderRoute implements Route {

    private path: string = '/order';

    private router: Router = express.Router();

    constructor () {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/add`, OrderController.add);
    }

    public getRouter(): Router {
        return this.router;
    }
}