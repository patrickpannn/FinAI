import express, { Router } from 'express';
import UserController from '../controllers/userController';
import Route from '../interfaces/routeInterface';
import UserAuthentication from '../middlewares/authentication';
import VerifyUser from '../middlewares/verifyUser';

export default class UserRoute implements Route {

    private path: string = '/user';

    private router: Router = express.Router();

    constructor () {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/signup`, UserController.signup);
        this.router.post(`${this.path}/login`, UserController.login);
        this.router.post(`${this.path}/logout `, UserAuthentication.auth, UserController.logout);
        this.router.post(`${this.path}/sendCode`, VerifyUser.verifyUser, UserController.sendCode);
        this.router.post(`${this.path}/verifyCode`, VerifyUser.verifyUser, UserController.verifyCode);
        this.router.put(`${this.path}/changeBalance`, UserAuthentication.auth, UserController.changeBalance);
        this.router.put(`${this.path}/resetPassword`, VerifyUser.verifyResetToken, UserController.resetPassword);
        this.router.put(`${this.path}/updateProfile`, UserAuthentication.auth, UserController.updateProfile);

    }

    public getRouter(): Router {
        return this.router;
    }
}