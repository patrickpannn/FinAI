import express, { Router } from 'express';
import UserController from '../controllers/userController';
import Route from '../interfaces/routeInterface';

export default class UserRoute implements Route {

    private path: string = '/user';

    private router: Router = express.Router();

    constructor () {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/signup`, UserController.signup);
    }

    public getRouter(): Router {
        return this.router;
    }
}