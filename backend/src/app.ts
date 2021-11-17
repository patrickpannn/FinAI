import express, { Application } from 'express';
import Route from './interfaces/routeInterface';
import cors from 'cors';
import Database from './db/database';
import * as http from 'http';
import { Server } from 'socket.io';

class App {

    private app: Application;

    private port: number | string;

    private server: http.Server;

    private io: Server;

    constructor(port: number | string, routes: Route[]) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: "*",
                methods: ['GET', 'POST'],
            }
        });
        this.port = port;
        this.run(routes);
    }
    
    private async run(routes: Route[]): Promise<void> {
        await this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
    }

    public listen(): void {
        this.server.listen(this.port, () => {
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

    public getIO(): Server {
        return this.io;
    }
}

export default App;