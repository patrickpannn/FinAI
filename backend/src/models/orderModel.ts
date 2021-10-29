import { Schema, model, Document } from 'mongoose';
import dotenv from 'dotenv';
import Stock from '../models/stockModel';

dotenv.config();

enum Direction {
  Sell= "SELL",
  Buy= "BUY",
}

// Document interface
interface OrderInterface extends Document {
  portfolio: Schema.Types.ObjectId,
  numUnits: number,
  ticker: string,
  executed: boolean,
  direction: string,
}

// Schema
const OrderSchema = new Schema<OrderInterface>({
  portfolio: {
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'portfolio',
  },
  numUnits: {
    type: Number, 
    validate(value: number): void {
      if (value <= 0){
        throw new Error("Number of units specified must be greater than 0");
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

// set the class expiry to be 24 hours after creation
OrderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

OrderSchema.post('remove', { document : true }, async function (next): Promise<void> {
  if(this.executed === true)
  {
    const stock = await Stock.findOne({ portfolio: this.portfolio });
    if(!stock)
    {
      throw new Error ("This stock no longer exists!");
    }

    if(this.direction == "SELL")
    {

      stock.numUnits = stock.numUnits - this.numUnits;
      if (stock.numUnits === 0)
      {
        stock.remove();
      }
      stock.save();
    } else // BUY
    {
      stock.numUnits = stock.numUnits + this.numUnits;
      stock.save();
    }
  }
});

export default model<OrderInterface>('order', OrderSchema);
