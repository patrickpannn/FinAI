import { Schema, model, Document } from 'mongoose';

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

PortfolioSchema.index({ user: 1, name: 1 }, { "unique": true } );

export default model<PortfolioInterface>('portfolio', PortfolioSchema);
