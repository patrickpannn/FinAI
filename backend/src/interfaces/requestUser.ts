import { Request } from 'express';
import { Document } from 'mongoose';

type Token = { token: string };

export interface UserInterface extends Document {
    username: string,
    email: string,
    password: string,
    balance: number,
    tokens: Token[],
    generateAuth: () => string,
    changeBalance: (value : number) => boolean;
};

export interface RequestUser extends Request {
    user?: UserInterface,
    token?: string,
}