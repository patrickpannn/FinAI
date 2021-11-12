import express, { Router } from 'express';
import Route from '../interfaces/routeInterface';
import AnalysisController from '../controllers/analysisController';
import UserAuthentication from '../middlewares/authentication';

export default class OrderRoute implements Route {

    private path: string = '/analysis';

    private router: Router = express.Router();

    constructor () {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // this endpoint is for demo
        this.router.get(`${this.path}`, UserAuthentication.auth, AnalysisController.testing);
    }

    public getRouter(): Router {
        return this.router;
    }
}