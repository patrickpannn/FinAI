import express, { Application, Request, Response, NextFunction } from 'express';
import { run } from './db/database';

const app: Application = express();
const port = process.env.PORT || 5000;
run();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello world!');
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
