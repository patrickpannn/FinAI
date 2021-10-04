import express, { Application, Request, Response, NextFunction } from 'express';
import Database from './db/database';
import cors from 'cors';

const port = process.env.PORT || 5000;

async function main(): Promise<void> {
    // Connect to MongoDB
    await Database.connect();

    const app: Application = express();
    app.use(express.json());
    app.use(cors());
    
    app.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.send('hello world!');
    });

    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });
}

main();


