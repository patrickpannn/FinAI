import { Document } from 'mongoose';

type Token = { token: string };

export interface UserInterface extends Document {
    username: string,
    email: string,
    password: string,
    balance: number,
    availableBalance: number,
    tokens: Token[],
    resetToken: string,
    numOrders: number,
    generateAuth: () => string,
    changeBalance: (value : number) => boolean;
};