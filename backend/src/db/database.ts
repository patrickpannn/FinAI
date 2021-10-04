import { ConnectOptions, connect } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

interface Options {
    useNewUrlParser: boolean,
    useUnifiedTopology: boolean
}

export default class Database {
    private static url: string = 
        process.env.MONGODB_URL || 
        'mongodb://localhost:27017/ezfins-api';

    private static options: Options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    static async connect(): Promise<void> {
        try {
            await connect(Database.url, Database.options as ConnectOptions);
            console.log("connect to the Database");
        } catch (e) {
            console.log(e);
        }
    }
}
