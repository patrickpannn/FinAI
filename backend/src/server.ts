import UserRoute from './routers/userRoute';
import WatchlistRoute from './routers/watchlistRoute';
import App from './app';
import dotenv from 'dotenv';
import PortfolioRoute from './routers/portfolioRoute';
import AnalysisRoute from './routers/analysisRoute';
import OrderRoute from './routers/orderRoute';

dotenv.config();

async function main(): Promise<void> {
    const port: number | string = process.env.PORT || 5000;
    const app = new App(port, [
        new UserRoute(),
        new WatchlistRoute(),
        new PortfolioRoute(),
        new OrderRoute(),
        new AnalysisRoute()
    ]);

    app.listen();
}

main();