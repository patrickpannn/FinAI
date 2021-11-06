import { Schema, model, Document } from 'mongoose';
import Stock from './stockModel';
import Portfolio from './portfolioModel';

interface PortfolioInterface extends Document {
    user: Schema.Types.ObjectId,
    name: string
};

const PortfolioSchema = new Schema<PortfolioInterface>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    name: {
        type: String,
        required: true,
        trim: true,
    }
});

PortfolioSchema.pre('deleteOne', { document: true }, async function (next): Promise<void> {
    try {
        if (this.name === "Default") {
            await Stock.deleteMany({ portfolio: this._id });
        } else {
            const defaultPortfolio = await Portfolio.findOne({
                user: this.user, name: "Default" });
    
            if (!defaultPortfolio) {
                throw new Error('Could not delete portfolio');
            }
            
            const stocks = await Stock.find({ portfolio: this._id });

            for (let i = 0; i < stocks.length; i++) {
                let stock = stocks[i];
                stock.merge(defaultPortfolio._id, stock.numUnits);
            }
        }
        next();
    } catch (e) {
        throw new Error('Failed in post remove portfolio function');
    }
});

PortfolioSchema.index({ user: 1, name: 1 }, { "unique": true } );

export default model<PortfolioInterface>('portfolio', PortfolioSchema);
