import { UserInterface } from '../interfaces/requestUser'; 

declare global {
    namespace Express {
        export interface Request {
            user: UserInterface,
            token: string
        }
    }
}