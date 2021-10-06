import { Schema, model, Document } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const accessKey: string = process.env.ACCESS_KEY || 'ezfinance111';
type Token = { token: string};

// Document interface
interface watchlistInterface extends Document {
  email: string;
  stock_ticker: string;
  tokens: Token[],
  generateAuth: () => string;
}

// Schema
const WatchlistSchema = new Schema<watchlistInterface>({
  email: { type: String, 
    required: true ,
    trim: true,
    validate(value: string): void {
      if (!validator.isEmail(value)){
        throw new Error('Email is invalid');
      }
    }
  },
  stock_ticker: { type: String, required: true, trim: true},
  tokens: [{token: {type: String, required: true, }}]
});

WatchlistSchema.methods.generateAuth = function(): string{
  const token: string = jwt.sign({ _id: this._id }, accessKey);
  return token;
}

export default model<watchlistInterface>('watchlist', WatchlistSchema);
