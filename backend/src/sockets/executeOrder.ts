import Websocket, { WebSocket } from 'ws';
import Order from '../models/orderModel';

class ExecuteOrder {

    private ws: WebSocket;

    constructor() {
        this.ws = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@trade/btcusdt@trade');
    };

    public initialize(): void {
        this.checkPrice();
    };

    private async checkPrice(): Promise<void> {
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
                    executed: false
                });
                for (const order of orders) {
                    const ticker = order.ticker.replace("BINANCE:", "");
                    if (ticker === symbol) {
                        if (order.direction === 'BUY' && order.executePrice >= marketPrice) {
                            order.executed = true;
                            await order.save();
                        } else if (order.direction === 'SELL' && order.executePrice <= marketPrice) {
                            order.executed = true;
                            await order.save();
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