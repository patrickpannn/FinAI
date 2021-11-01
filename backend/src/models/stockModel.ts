import { Schema, model, Document } from 'mongoose';

interface StockInterface extends Document {
    portfolio: Schema.Types.ObjectId,
    ticker: string,
    stockName: string,
    averagePrice: number,
    numUnits: number
};

const StockSchema = new Schema<StockInterface>({
    portfolio: {
        type: Schema.Types.ObjectId,
        required: true, 
        ref: 'portfolio'
    },
    ticker: {
        type: String,
        required: true,
        trim: true,
    },
    stockName: {
        type: String,
        required: true,
        trim: true,
    },
    averagePrice: {
        type: Number,
        required: true,
        validate(value: number): void {
            if (value <= 0) {
                throw new Error('The average price should greater than zero.');
            }
        }
    },
    numUnits: {
        type: Number,
        required: true,
        validate(value: number): void {
            if (value <= 0) {
                throw new Error('At least one unit should be owned.');
            }
        }
    }
});

StockSchema.index({ portfolio: 1, ticker: 1 }, { "unique": true } );

export default model<StockInterface>('stock', StockSchema);