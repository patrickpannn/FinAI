import { Schema, model, Document } from 'mongoose';
import Stock from './stockModel';

interface StockInterface extends Document {
    portfolio: Schema.Types.ObjectId,
    ticker: string,
    name: string,
    averagePrice: number,
    numUnits: number,
    merge: (newPortfolioId: Schema.Types.ObjectId,
            amount: number) => Promise<void>;
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
    name: {
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

StockSchema.methods.merge = async function 
                            (newPortfolioId: Schema.Types.ObjectId,
                             amount: number): Promise<void> {
    try {
        if (amount > this.numUnits) {
            throw new Error('Moving more stocks than possible');
        }

        const originalStock = await Stock.findOne({ portfolio: newPortfolioId,
                                                    ticker: this.ticker });

        if (!originalStock) {
            if (amount === this.numUnits) {
                this.portfolio = newPortfolioId;
            } else {
                this.numUnits -= amount;
                const newStock = new Stock({ portfolio: newPortfolioId,
                                            ticker: this.ticker,
                                            name: this.name,
                                            averagePrice: this.averagePrice,
                                            numUnits: amount });
                await newStock.save();
            }
            this.save();
        } else {
            const avg = (originalStock.numUnits * originalStock.averagePrice + 
                         amount * this.averagePrice) / 
                        (originalStock.numUnits + amount);

            originalStock.numUnits += amount;
            originalStock.averagePrice = avg;
            originalStock.save();

            if (amount === this.numUnits) {
                this.remove();
            } else {
                this.numUnits -= amount;
                this.save();
            }
        }
    } catch (e) {
        console.log('Failed to merge stocks together');
    }
};

StockSchema.index({ portfolio: 1, ticker: 1 }, { "unique": true } );

export default model<StockInterface>('stock', StockSchema);