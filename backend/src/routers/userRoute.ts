import express, { Router } from 'express';
import UserController from '../controllers/userController';
import Route from '../interfaces/routeInterface';
import UserAuthentication from '../middlewares/authentication';

export default class UserRoute implements Route {

    private path: string = '/user';

    private router: Router = express.Router();

    constructor () {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/signup`, UserController.signup);
        this.router.post(`${this.path}/login`, UserController.login);
        this.router.put(`${this.path}/updateProfile`, UserAuthentication.auth, UserController.updateProfile);
    }

    public getRouter(): Router {
        return this.router;
    }
}