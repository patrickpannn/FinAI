import express, { Router } from 'express';
import WatchlistController from '../controllers/watchlistController';
import Route from '../interfaces/routeInterface';
import UserAuthentication from '../middlewares/authentication';

export default class WatchlistRoute implements Route {

    private path: string = 'user/watchlist';

    private router: Router = express.Router();

    constructor () {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.put(`${this.path}/add`, UserAuthentication.auth, WatchlistController.add);
    }

    public getRouter(): Router {
        return this.router;
    }
}