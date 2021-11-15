import express, { Router } from 'express';
import PortfolioController from '../controllers/portfolioController';
import Route from '../interfaces/routeInterface';
import UserAuthentication from '../middlewares/authentication';

export default class PortfolioRoute implements Route {

    private path: string = '/user/portfolio';

    private router: Router = express.Router();

    constructor () {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(`${this.path}`, UserAuthentication.auth, PortfolioController.list);
        this.router.post(`${this.path}/create`, UserAuthentication.auth, PortfolioController.create);
        this.router.delete(`${this.path}/delete`, UserAuthentication.auth, PortfolioController.delete);
        this.router.put(`${this.path}/move`, UserAuthentication.auth, PortfolioController.move);
    }

    public getRouter(): Router {
        return this.router;
    }
}