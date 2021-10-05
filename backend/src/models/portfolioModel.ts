import { Schema, model, Document } from 'mongoose';
import validator from 'validator';
import dotenv from 'dotenv';
dotenv.config();

interface PortfolioInterface extends Document {
    email: string,
    name: string
};

const PortfolioSchema = new Schema<PortfolioInterface>({
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value: string): void {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid.');
            }
        }
    },
    name: {
        type: String,
        required: true,
        trim: true,
    }
});

PortfolioSchema.index({ email: 1, name: 1 }, { "unique": true } );
