import { Schema, model, Document } from 'mongoose';
import Portfolio from './portfolioModel';
import Stock from './stockModel';
import User from './userModel';

// Document interface
interface OrderInterface extends Document {
    user: Schema.Types.ObjectId,
    portfolio: Schema.Types.ObjectId,
    numUnits: number,
    executePrice: number,
    ticker: string,
    name: string,
    executed: boolean,
    direction: string,
    isLimitOrder: boolean,
    getObject: () => {};
}

// Schema
const OrderSchema = new Schema<OrderInterface>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    portfolio: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'portfolio',
    },
    numUnits: {
        type: Number,
        required: true,
        validate(units: number): void {
            if (units <= 0) {
                throw new Error('You must order a positive quantity of stock shares');
            }
        }
    },
    executePrice: {
        type: Number,
        required: true,
        validate(price: number): void {
            if (price <= 0) {
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
    isLimitOrder: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true });

OrderSchema.methods.getObject = async function (): Promise<{}> {

    try {
        const orderPortfolio = await Portfolio.findOne({ id: this.portfolio });

        if (!orderPortfolio) {
            throw new Error('Could not find portfolio associated with order');
        }

        let orderObj = {
            id: this._id,
            numUnits: this.numUnits,
            executePrice: this.executePrice,
            ticker: this.ticker,
            name: this.name,
            executed: this.executed,
            direction: this.direction,
            portfolio: orderPortfolio.name
        };

        return orderObj;
    } catch (e) {
        throw new Error('Could not return order object');
    }
};

OrderSchema.post('save', { document: true }, async function (next): Promise<void> {
    try {
        if (this.executed === true && this.isLimitOrder) {
            const user = await User.findById(this.user);
            if (!user) {
                throw new Error('Could not find user');
            }
            const existingStock = await Stock.findOne({
                user: this.user,
                portfolio: this.portfolio,
                ticker: this.ticker
            });
            if (this.direction === "SELL") // selling an existing stock
            {
                if (!existingStock) {
                    throw new Error('Could not find stock!');
                }
                if (existingStock.numUnits === 0) {
                    await existingStock.delete();
                }
                user.balance +=
                    parseFloat((this.executePrice * this.numUnits).toFixed(2));
            } else // purchasing a stock which may or may not already exist in the specified portfolio
            {
                if (existingStock) {
                    const avg = (
                        (existingStock.numUnits * existingStock.averagePrice +
                            this.numUnits * this.executePrice) /
                        (existingStock.numUnits + this.numUnits)).toFixed(2);

                    existingStock.numUnits += this.numUnits;
                    existingStock.averagePrice = parseFloat(avg);

                    await existingStock.save();
                } else {
                    const newStock = new Stock({
                        portfolio: this.portfolio,
                        ticker: this.ticker,
                        name: this.name,
                        averagePrice: this.executePrice,
                        numUnits: this.numUnits
                    });
                    if (!newStock) {
                        throw new Error('Could not create stock');
                    }
                    await newStock.save();
                }
                user.balance -=
                    parseFloat((this.executePrice * this.numUnits).toFixed(2));
                user.numOrders--;
                await user.save();
            }
        }
    } catch (e) {
        throw new Error('Failed to save the model');
    }
});

export default model<OrderInterface>('order', OrderSchema);
