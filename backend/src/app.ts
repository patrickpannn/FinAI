import express, { Application } from 'express';
import Route from './interfaces/routeInterface';
import cors from 'cors';
import Database from './db/database';

class App {

    private app: Application;

    private port: number | string;

    constructor(port: number | string, routes: Route[]) {
        this.app = express();
        this.port = port;
        this.run(routes);
    }
    
    private async run(routes: Route[]): Promise<void> {
        await this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server is listening on the port ${this.port}`);
        });
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(cors());
    }

    private initializeRoutes(routes: Route[]): void {
        routes.forEach((route) => {
            this.app.use(route.getRouter());
        });
    }

    private async connectToTheDatabase(): Promise<void> {
        await Database.connect();
    }
}

export default App;