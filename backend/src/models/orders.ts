import { Schema } from 'mongoose';

// Document interface
interface Order {
  ID: string;
  email: string;
  executed: boolean;
  stock_ticker: string;
  purchase_price: number;
  purchase_units: number;
}

// Schema
const schema = new Schema<Order>({
  ID: { type: String, required: true },
  email: { type: String, required: true },
  executed: { type: Boolean, required: true },
  stock_ticker: { type: String, required: true },
  purchase_price: { type: "number", required: true },
  purchase_units: { type: "number", required: true },
});

const orders = model<Order>('Orders', schema);
