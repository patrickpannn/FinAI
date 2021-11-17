import UserRoute from './routers/userRoute';
import WatchlistRoute from './routers/watchlistRoute';
import App from './app';
import dotenv from 'dotenv';
import PortfolioRoute from './routers/portfolioRoute';
import OrderRoute from './routers/orderRoute';
import AnalysisRoute from './routers/analysisRoute';
import { Socket } from 'socket.io';
import ExecuteOrder from './sockets/executeOrder';
dotenv.config();

async function main(): Promise<void> {
    const port: number | string = process.env.PORT || 5000;
    const app = new App(port, [
        new UserRoute(),
        new WatchlistRoute(),
        new PortfolioRoute(),
        new OrderRoute(),
        new AnalysisRoute(),
    ]);
    const io = app.getIO();
    io.on("connection", (socket: Socket) => {
        console.log("new Connection", socket.id);
        const executeOrder = new ExecuteOrder(socket);
        executeOrder.initialize();
    });
    app.listen();
}

main();