import { Schema, model, Document } from 'mongoose';

export type Ticker = { ticker: string, stockName: string };

// Document interface
interface WatchlistInterface extends Document {
  user: Schema.Types.ObjectId,
  tickers: Array<Ticker>
}

// Schema
const WatchlistSchema = new Schema<WatchlistInterface>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  tickers: [{
    ticker: {
      type: String,
      required: true,
      trim: true
    },
    stockName: {
      type: String,
      required: true,
      trim: true
    }
  }]
});

export default model<WatchlistInterface>('watchlist', WatchlistSchema);
