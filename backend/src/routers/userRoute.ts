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
        this.router.post(`${this.path}/logout`,         UserAuthentication.auth, UserController.logout);
        this.router.put(`${this.path}/change_balance`, UserAuthentication.auth, UserController.change_balance);
        this.router.delete(`${this.path}/delete_account`, UserAuthentication.auth, UserController.delete_account);

    }

    public getRouter(): Router {
        return this.router;
    }
}