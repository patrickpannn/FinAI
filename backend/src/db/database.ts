import { ConnectOptions, connect } from 'mongoose';

export async function run(): Promise<void> {
    try {
        await connect('mongodb://localhost:27017/ezfins-api', { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions);
    } catch (e) {
        console.log(e);
    }
}