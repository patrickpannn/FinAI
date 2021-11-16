import UserRoute from './routers/userRoute';
import WatchlistRoute from './routers/watchlistRoute';
import App from './app';
import dotenv from 'dotenv';
import PortfolioRoute from './routers/portfolioRoute';
import AnalysisRoute from './routers/analysisRoute';
import OrderRoute from './routers/orderRoute';
<<<<<<< HEAD

=======
import AnalysisRoute from './routers/analysisRoute';
>>>>>>> c1d7a27ae4c8f6c87568111f5a63881277d726b8
dotenv.config();

async function main(): Promise<void> {
    const port: number | string = process.env.PORT || 5000;
    const app = new App(port, [
        new UserRoute(),
        new WatchlistRoute(),
        new PortfolioRoute(),
        new OrderRoute(),
<<<<<<< HEAD
        new AnalysisRoute()
=======
        new AnalysisRoute(),
>>>>>>> c1d7a27ae4c8f6c87568111f5a63881277d726b8
    ]);

    app.listen();
}

main();