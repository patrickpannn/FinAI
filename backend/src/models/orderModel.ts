import { Schema, model, Document } from 'mongoose';
import dotenv from 'dotenv';
import Stock from '../models/stockModel';
import { StringifyOptions } from 'querystring';
dotenv.config();

// Document interface
interface OrderInterface extends Document {
  user: Schema.Types.ObjectId,
  numUnits: number,
  executePrice: number,
  ticker: string,
  name: string,
  executed: boolean,
  direction: string,
  portfolio: string,
}

// Schema
const OrderSchema = new Schema<OrderInterface>({
  user: {
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'order',
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
  },
  portfolio: {
    type: String,
    required: true,
    trim: true,
  }
}, { timestamps: true });

OrderSchema.post('remove', { document : true }, async function (next): Promise<void> {
  if(this.executed === true)
  {
    /*
    const stock = await Stock.findOne({ user: this.order });
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
    */
  }
});

export default model<OrderInterface>('order', OrderSchema);
