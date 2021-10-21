import { Document } from 'mongoose';

type Token = { token: string };

export interface UserInterface extends Document {
    username: string,
    email: string,
    password: string,
    balance: number,
    tokens: Token[],
    resetToken: string,
    generateAuth: () => string,
};