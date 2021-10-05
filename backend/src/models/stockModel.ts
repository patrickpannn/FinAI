import { Schema, model, Document } from 'mongoose';
import validator from 'validator';
import dotenv from 'dotenv';
dotenv.config();

interface StockInterface extends Document {
    email: string,
    portfolioName: string,
    ticker: string,
    averagePrice: number,
    numUnits: number
};

const StockSchema = new Schema<StockInterface>({
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value: string): void {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid.');
            }
        }
    },
    portfolioName: {
        type: String,
        required: true,
        trim: true,
    },
    ticker: {
        type: String,
        required: true,
        trim: true,
    },
    averagePrice: {
        type: Number,
        required: true,
    },
    numUnits: {
        type: Number,
        required: true,
    }
});

StockSchema.index({ email: 1, portfolioName: 1, ticker: 1 }, { "unique": true } );