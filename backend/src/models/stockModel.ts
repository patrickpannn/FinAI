import { Schema, model, Document } from 'mongoose';

interface StockInterface extends Document {
    user: Schema.Types.ObjectID,
    portfolio: Schema.Types.ObjectID,
    ticker: string,
    averagePrice: number,
    numUnits: number
};

const StockSchema = new Schema<StockInterface>({
    user: {
        type: Schema.Types.ObjectID,
        required: true,
        ref: 'user'
    },
    portfolio: {
        type: Schema.Types.ObjectID,
        required: true,
        ref: 'portfolio'
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

StockSchema.index({ user: 1, portfolio: 1, ticker: 1 }, { "unique": true } );

export default model<StockInterface>('stock', StockSchema);