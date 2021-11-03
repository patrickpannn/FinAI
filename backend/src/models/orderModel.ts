import { Schema, model, Document } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Document interface
interface OrderInterface extends Document {
  user: Schema.Types.ObjectId,
  portfolio: string,
  numUnits: number,
  executePrice: number,
  ticker: string,
  name: string,
  executed: boolean,
  direction: string,
}

// Schema
const OrderSchema = new Schema<OrderInterface>({
  user: {
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'user',
  },
  portfolio: {
    type: String,
    required: true,
  },
  numUnits: {
    type: Number, 
    required: true,
    validate(units: number): void {
      if(units <=0)
      {
        throw new Error('You must order a positive quantity of stock shares');
      }
    }
  },
  executePrice: {
    type: Number,
    required: true,
    validate(price: number): void {
      if(price <=0)
      {
        throw new Error('You must specify a positive price for your limit order');
      }
    }
  },
  ticker: { 
    type: String, 
    required: true, 
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  executed: {
    type: Boolean,
    trim: true,
    default: false,
  },
  direction: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default model<OrderInterface>('order', OrderSchema);
