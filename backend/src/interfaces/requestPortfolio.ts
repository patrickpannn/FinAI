import { Schema, Document } from 'mongoose';

export interface PortfolioInterface extends Document {
    user: Schema.Types.ObjectId,
    name: string
};