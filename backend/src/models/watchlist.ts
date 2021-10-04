import { Schema } from 'mongoose';

// Document interface
interface User {
  name: string;
  email: string;
  stock_ticker: string;
}

// Schema
const schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  stock_ticker: { type: String, required: true}
});