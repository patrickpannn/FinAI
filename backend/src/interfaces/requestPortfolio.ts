import { Schema, Document } from 'mongoose';

// The portfolio interface is used by the order controller
// to specify the specific portfolio associated with an order
export interface PortfolioInterface extends Document {
    user: Schema.Types.ObjectId,
    name: string
};
