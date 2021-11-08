import { Schema, model, Document } from 'mongoose';
import { PortfolioInterface } from '../interfaces/requestPortfolio';

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

PortfolioSchema.index({ user: 1, name: 1 }, { "unique": true } );

export default model<PortfolioInterface>('portfolio', PortfolioSchema);
