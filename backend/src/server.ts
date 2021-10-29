import UserRoute from './routers/userRoute';
import WatchlistRoute from './routers/watchlistRoute';
import OrderRoute from './routers/orderRoute';
import App from './app';
import dotenv from 'dotenv';
import PortfolioRoute from './routers/portfolioRoute';
dotenv.config();

async function main(): Promise<void> {
    const port: number | string = process.env.PORT || 5000;
    const app = new App(port, [
        new UserRoute(),
        new OrderRoute(),
        new PortfolioRoute()
    ]);

    app.listen();
}

main();