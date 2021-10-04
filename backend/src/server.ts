import UserRoute from './routers/userRoute';
import App from './app';
import dotenv from 'dotenv';
dotenv.config();

async function main(): Promise<void> {
    const port: number | string = process.env.PORT || 5000;
    const app = new App(port, [
        new UserRoute(),
    ]);

    app.listen();
}

main();