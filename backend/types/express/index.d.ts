import { UserInterface } from '../interfaces/requestUser'; 
import { WatchlistInterface } from '../models/watchlistModel';

declare global {
    namespace Express {
        export interface Request {
            user: UserInterface,
            token: string,
            watchlist: WatchlistInterface
        }
    }
}