import { Schema, model, Document } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Document interface
interface WatchlistInterface extends Document {
  user: Schema.Types.ObjectId;
  stock_ticker: string;
}

// Schema
const WatchlistSchema = new Schema<WatchlistInterface>({
  user: {
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'user'
  },
  stock_ticker: { 
    type: String, 
    required: true, 
    trim: true
  }
});

export default model<WatchlistInterface>('watchlist', WatchlistSchema);
