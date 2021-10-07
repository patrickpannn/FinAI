import { Schema, model, Document } from 'mongoose';

interface PortfolioInterface extends Document {
    name: string,
    user: Schema.Types.ObjectID
};

const PortfolioSchema = new Schema<PortfolioInterface>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: Schema.Types.ObjectID,
        required: true,
        ref: 'user'
    }
});

PortfolioSchema.index({ name: 1, user: 1 }, { "unique": true } );

export default model<PortfolioInterface>('portfolio', PortfolioSchema);
