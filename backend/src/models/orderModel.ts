import { Schema, model, Document } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();


// Document interface
interface OrderInterface extends Document {
  email: string;
  purchase_date: string;
  purchase_quantity: number;
  purchase_price: number;
  stock_ticker: string;
}

// Schema
const OrderSchema = new Schema<OrderInterface>({
  email: { type: String, 
    required: true ,
    trim: true,
    validate(value: string): void {
      if (!validator.isEmail(value)){
        throw new Error('Email is invalid');
      }
    }
  },
  purchase_date: {type: String, required: true, trim: true},
  purchase_quantity: {type: Number, required: true, trim: true},
  purchase_price: {type: Number, required: true, trim: true},
  stock_ticker: { type: String, required: true, trim: true}
});


export default model<OrderInterface>('order', OrderSchema);
