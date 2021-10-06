import express, { Router } from 'express';
import WatchlistController from '../controllers/watchlistController';
import Route from '../interfaces/routeInterface';

export default class WatchlistRoute implements Route {

    private path: string = '/watchlist';
    private router: Router = express.Router();

    constructor () {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/append`, WatchlistController.append);
    }

    public getRouter(): Router {
        return this.router;
    }
}