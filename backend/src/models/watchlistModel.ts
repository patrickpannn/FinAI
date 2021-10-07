import { Schema, model, Document } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

// Document interface
interface WatchlistInterface extends Document {
  email: string;
  stock_ticker: string;
}

// Schema
const WatchlistSchema = new Schema<WatchlistInterface>({
  email: { type: String, 
    required: true ,
    trim: true,
    validate(value: string): void {
      if (!validator.isEmail(value)){
        throw new Error('Email is invalid');
      }
    }
  },
  stock_ticker: { type: String, required: true, trim: true}
});

export default model<WatchlistInterface>('watchlist', WatchlistSchema);
