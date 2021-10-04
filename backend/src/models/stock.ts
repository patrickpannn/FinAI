import { Schema } from 'mongoose';

// Document interface
interface User {
  ID: string;
  portfolio_name: string;
  email: string;
  stock_ticker: string;
  average_price: Number;
  units: Number;
}

// Schema
const schema = new Schema<User>({
  ID: { type: String, required: true },
  portfolio_name: { type: String, required: true},
  email: { type: String, required: true },
  stock_ticker: { type: String, required: true},
  average_price: { type: "number", required: true},
  units: { type: "number", required: true}
});