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
            
            await Stock.updateMany({ portfolio: this._id },
                                   { portfolio: defaultPortfolio._id });
        }
    } catch (e) {
        console.log('Failed in post remove portfolio function');
    }
    next();
});

PortfolioSchema.index({ user: 1, name: 1 }, { "unique": true } );

export default model<PortfolioInterface>('portfolio', PortfolioSchema);
