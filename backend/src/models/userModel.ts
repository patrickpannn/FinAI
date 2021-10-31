import { Schema, model } from 'mongoose';
import { UserInterface } from '../interfaces/requestUser';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const accessKey: string = process.env.ACCESS_KEY || 'ezfinance111';

const UserSchema = new Schema<UserInterface>({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value: string): void {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid.');
            }
        }
    },
    password: {
        type: String,
        requried: true,
        trim: true,
        minLength: 8,
    },
    balance: {
        type: Number,
        default: 0,
        validate(value: number): void {
            if (value < 0) {
                throw new Error('The cash balance should be greater than 0.');
            }
        }
    },
    availableBalance: {
        type: Number,
        default: 0,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    resetToken: {
        type: String,
        default: "",
    }
});

// The function will be executed before saving the data to the DB
UserSchema.pre('save', async function (next): Promise<void> {
    if (this.isModified('password')) {
        const hashedPassword: string = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

//This is a clas method to change the users balance
UserSchema.methods.changeBalance = function (value: number): boolean {
    if(this.balance + value < 0)
    {
        throw new Error('Your balance is too low to make this request');
    }
    if(this.availableBalance + value < 0)
    {
        throw new Error('Your available balance is too low to make this request');
    }
    this.balance = this.balance + value;
    this.availableBalance = this.availableBalance + value; 
    return true;
};

// This is a class method to generate authentication token
UserSchema.methods.generateAuth = function (): string {
    const token: string = jwt.sign({ _id: this._id }, accessKey);
    return token;
};

export default model<UserInterface>('user', UserSchema);
