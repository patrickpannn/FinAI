import { UserInterface } from '../interfaces/requestUser'; 
import { PortfolioInterface } from '../interfaces/requestPortfolio';

declare global {
    namespace Express {
        export interface Request {
            user: UserInterface,
            token: string,
            portfolio: PortfolioInterface;
        }
    }
}