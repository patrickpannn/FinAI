import { Socket } from "socket.io";
import Websocket, { WebSocket } from 'ws';
import Order from '../models/orderModel';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const accessKey: string = process.env.ACCESS_KEY || 'ezfinance111';

class ExecuteOrder {

    private socket: Socket;

    private ws: WebSocket = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@trade/btcusdt@trade');

    constructor(socket: Socket) {
        this.socket = socket;
    };

    public initialize(): void {
        this.setupConnection();
    };

    private setupConnection(): void {
        this.socket.on("join", ({ token }) => {
            this.checkPrice(token);
        });
    };

    private async checkPrice(token: string): Promise<void> {

        const userId = jwt.verify(token, accessKey) as JwtPayload;
        this.ws.onopen = (): void => {
            console.log("Binance socket open");
        };

        this.ws.onmessage = async (
            event: Websocket.MessageEvent
        ): Promise<void> => {
            const stockObj = JSON.parse(event.data.toString());
            const marketPrice = parseFloat(stockObj.p);
            const symbol = stockObj.s;
            try {
                const orders = await Order.find({
                    user: userId._id,
                    executed: false
                });
                for (const order of orders) {
                    const ticker = order.ticker.replace("BINANCE:", "");
                    if (ticker === symbol) {
                        if (order.direction === 'BUY' && order.executePrice >= marketPrice) {
                            console.log("executed");
                            order.executed = true;
                            await order.save();
                            this.socket.emit('notification', 'Buy Order Executed!');
                        } else if (order.direction === 'SELL' && order.executePrice <= marketPrice) {
                            order.executed = true;
                            await order.save();
                            this.socket.emit('notification', 'Sell Order Executed!');
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };

        this.ws.onclose = (): void => {
            console.log("Binance socket close");
        };
    }


}

export default ExecuteOrder;