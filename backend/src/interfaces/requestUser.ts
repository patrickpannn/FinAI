import { Request } from 'express';
import { Document } from 'mongoose';

type Token = { token: string };

interface UserInterface extends Document {
    username: string,
    email: string,
    password: string,
    balance: number,
    tokens: Token[]
};

export interface RequestUser extends Request {
    user?: UserInterface,
    token?: string,
}