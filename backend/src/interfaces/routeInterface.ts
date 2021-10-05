import { Router } from 'express';

export default interface Route {
    getRouter(): Router
}