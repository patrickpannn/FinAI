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
            if(units <=0)
            {
                throw new Error('You must order a positive quantity of stock shares');
            }
        }
    },
    executePrice: {
        type: Number,
        required: true,
        validate(price: number): void {
            if(price <=0)
            {
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
    }
}, { timestamps: true });

OrderSchema.methods.getObject = async function (): Promise<{}> {

    try {
        const orderPortfolio = await Portfolio.findOne({ id: this.portfolio });

        if (!orderPortfolio) {
            throw new Error('Could not find portfolio associated with order');
        }

        let orderObj = {
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

OrderSchema.post('save', { document : true }, async function (next): Promise<void> {
    if(this.executed === true)
    {
        console.log('bababaooi');
        const user = await User.findOne({
            user: this.user});
        if(!user)
        {
            throw new Error('Could not find user');
        }
        const stock = await Stock.findOne({
            user: this.user,
            portfolio: this.portfolio,
            ticker: this.ticker
        });
        if(this.direction === "SELL") // selling an existing stock
        {
            if(!stock)
            {
                throw new Error('Could not find stock!');
            }
            if(stock.numUnits === 0)
            {
                stock.delete();
            }
            user.balance += parseFloat((this.executePrice * this.numUnits).toFixed(2));
        } else // purchasing a stock which may or may not already exist in the specified portfolio
        {
            if(stock)
            {
                const avg = (
                    (stock.numUnits * stock.averagePrice +
                    this.numUnits * this.executePrice) / (stock.numUnits + this.numUnits)
                                                                            ).toFixed(2);
                stock.numUnits += this.numUnits;
                stock.averagePrice = parseFloat(avg);
                stock.save();
            } else
            {
                const stock = new Stock({
                    portfolio: this.portfolio,
                    ticker: this.ticker,
                    name: this.name,
                    averagePrice: this.executePrice, // TO BE CONFIRMED
                    numUnits: this.numUnits
                });
                if(!stock)
                {
                    throw new Error('Could not create stock');
                }
                stock.save();
            }
            user.balance -= parseFloat((this.executePrice * this.numUnits).toFixed(2));
            user.save();
        }
    }
});

export default model<OrderInterface>('order', OrderSchema);
