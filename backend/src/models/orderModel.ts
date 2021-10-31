import { Schema, model, Document } from 'mongoose';
import dotenv from 'dotenv';
import Stock from '../models/stockModel';
dotenv.config();

// Document interface
interface OrderInterface extends Document {
  user: Schema.Types.ObjectId,
  numUnits: number,
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
    ref: 'order',
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
