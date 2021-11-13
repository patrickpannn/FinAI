import { Request, Response } from 'express';
import axios from 'axios';

const dividendStock = "OMC";
const riskStock = "AAPL";

function getValue(): number {
    return 0.1;
}

function getPast(): number {
    return 0.2;
}

function getFuture(): number {
    return 0.3;
}

async function getRisk(ticker: String): Promise<number> {

    try {
        const stockResponse = await axios.get(
            `https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=c5vln0iad3ibtqnna830`);
        const compareResponse = await axios.get(
            `https://finnhub.io/api/v1/stock/metric?symbol=${riskStock}&metric=all&token=c5vln0iad3ibtqnna830`);


        if (!stockResponse.data.metric.freeCashFlowPerShareTTM || 
            !compareResponse.data.metric.freeCashFlowPerShareTTM) {
                console.log("Risk")
                throw new Error("Unable to determine dividend yield");
        }

        const stockRisk = stockResponse.data.metric.freeCashFlowPerShareTTM;
        const comparisonRisk = compareResponse.data.metric.freeCashFlowPerShareTTM;
        
        let value = 0.8 + ((stockRisk - comparisonRisk) / comparisonRisk);

        if (value > 1) {
            value = 1;
        } else if (value < 0) {
            value = 0;
        }

        return value;
    } catch (e) {
        return -1;
    }
}

async function getDividend(ticker: String): Promise<number> {

    const stockResponse = await axios.get(
        `https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=c5vln0iad3ibtqnna830`);
    const compareResponse = await axios.get(
        `https://finnhub.io/api/v1/stock/metric?symbol=${dividendStock}&metric=all&token=c5vln0iad3ibtqnna830`);


    if (!stockResponse.data.metric.dividendYield5Y || 
        !compareResponse.data.metric.dividendYield5Y) {
            throw new Error("Unable to determine dividend yield");
    }

    const stockYield = stockResponse.data.metric.dividendYield5Y;
    const comparisonYield = compareResponse.data.metric.dividendYield5Y;
    
    let value = 0.8 + ((stockYield - comparisonYield) / comparisonYield);

    if (value > 1) {
        value = 1;
    } else if (value < 0) {
        value = 0;
    }

    return value;
}

export default class AnalysisController {
    public static snowflake = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            if (Object.keys(req.body).length !== 1 || !req.body.ticker) {
                throw new Error('Incorrect inputs given');
            }

            const snowflake = {
                value: getValue(),
                past: getPast(),
                future: getFuture(),
                health: await getRisk(req.body.ticker),
                dividend: await getDividend(req.body.ticker)
            };
            res.status(200).json(snowflake);
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}