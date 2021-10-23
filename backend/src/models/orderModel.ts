import { Schema, model, Document } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

enum Direction {
  Sell= "SELL",
  Buy= "BUY",
}

// Document interface
interface OrderInterface extends Document {
  user: Schema.Types.ObjectId,
  purchase_quantity: number,
  purchase_price: number,
  ticker: string,
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
  purchase_quantity: {
    type: Number, 
    validate(value: number): void {
      if (value <= 0){
        throw new Error("Quantity specified must be greater than 0");
      }
    }
  },
  purchase_price: {
    type: Number, 
    validate(value: number): void {
      if (value <= 0){
        throw new Error("Price specified must be greater than 0");
      }
    }
  },
  ticker: { 
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
    enum: ['SELL', 'BUY'],
    required: true,
  }
}, { timestamps: true });

OrderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default model<OrderInterface>('order', OrderSchema);
