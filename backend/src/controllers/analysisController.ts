import { Request, Response } from 'express';
import axios from 'axios';

const dividendStock = "OMC";

const stockName = "AAPL";

const SMP500 = "SPX";
const NASDAQ = "IXIC";
const DOWJONES = "DJI"

async function getValue(ticker: String, cashFlow: number): Promise<number> {

    try {
        const stockQuote = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c5vln0iad3ibtqnna830`);

        if (!stockQuote.data.c) {
            throw new Error("Unable to get the stock price");
        }

        const stockValue = cashFlow;
        const stockCost = stockQuote.data.c;

        const value = (stockCost - stockValue) / stockCost;

        return value;
    } catch (e) {
        return -1;
    }

}

async function getPast(
    ticker: string
): Promise<number>{
    try{
        /*
        const indices = [
            await axios.get(
                `https://api.twelvedata.com/time_series?symbol=${NASDAQ}&interval=1month&outputsize=12&apikey=614acd00d55849d19a5fca8f5f6ca17a`),
            await axios.get(
                `https://api.twelvedata.com/time_series?symbol=${SMP500}&interval=1month&outputsize=12&apikey=614acd00d55849d19a5fca8f5f6ca17a`),
            await axios.get(
                `https://api.twelvedata.com/time_series?symbol=${DOWJONES}&interval=1month&outputsize=12&apikey=614acd00d55849d19a5fca8f5f6ca17a`),
            ] as const;
        console.log(indices[0].data);
*/
        const stockResponse = await axios.get(
          `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=M&from=${Math.floor(Date.now() / 1000 - 31536000)}&to=${Math.floor(Date.now() / 1000)}&token=c5vln0iad3ibtqnna830`);

        const stockPrices = Array(stockResponse.data.c)[0];
        
        let sumXY: number = 0.0;
        let sumY: number = 0.0;
        let sumX: number = 0.0;
        let xCounter: number = 1;
        let sumXSquared: number = 0.0;


        stockPrices.forEach((element: number) => {
            sumXY += element*xCounter;
            sumY += element;
            sumX += xCounter;
            sumXSquared += xCounter^2;
            xCounter++;
        });
        const stockGrad = (stockPrices.length*sumXY-sumY*sumX)/(stockPrices.length*sumXSquared-sumX^2);


        // Get index gradient for past year
        const index = await axios.get(
            `https://api.twelvedata.com/time_series?symbol=${NASDAQ}&interval=1month&outputsize=12&apikey=614acd00d55849d19a5fca8f5f6ca17a`);
        const indexValues = index.data.values;

        let indexSumXY: number = 0.0;
        let indexSumY: number = 0.0;
        let indexSumX: number = 0.0;
        let indexXCounter: number = 1;
        let indexSumXSquared: number = 0.0;

        for(indexXCounter = 1; xCounter < indexValues.length; indexXCounter++){
            indexSumXY += +indexValues[indexXCounter].close*indexXCounter;
            indexSumY += +indexValues[indexXCounter].close;
            indexSumX += indexXCounter;
            indexSumXSquared += Math.pow(indexXCounter,2);
        }
        const indexGrad = (indexValues.length*indexSumXY-indexSumY*indexSumX)/(indexValues.length*indexSumXSquared-indexSumX^2);
        console.log(indexGrad);
        return 0.2;

    } catch(e)
    {
        return -1;
    }
}

function getFuture(): number {
    return 0.3;
}

async function getRisk(
    stockRiskYear1: number,
    stockRiskYear2: number
): Promise<number> {

    try {        
        let value = 0.5 + ((stockRiskYear1 - stockRiskYear2) / stockRiskYear2);

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

async function getDividend(stockYield: number): Promise<number> {

    try {
        const compareResponse = await axios.get(
            `https://finnhub.io/api/v1/stock/metric?symbol=${dividendStock}&metric=all&token=c5vln0iad3ibtqnna830`);


        if (!compareResponse.data.metric.dividendYield5Y) {
                throw new Error("Unable to determine dividend yield");
        }

        const comparisonYield = compareResponse.data.metric.dividendYield5Y;
        
        let value = 0.8 + ((stockYield - comparisonYield) / comparisonYield);

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

export default class AnalysisController {
    public static snowflake = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            if (Object.keys(req.body).length !== 1 || !req.body.ticker) {
                throw new Error('Incorrect inputs given');
            }

            const stockResponse = await axios.get(
                `https://finnhub.io/api/v1/stock/metric?symbol=${req.body.ticker}&metric=all&token=c5vln0iad3ibtqnna830`);
            
            let valueValue = 0;

            if (!stockResponse.data.metric.freeCashFlowPerShareTTM) {
                valueValue = -1;
            } else {
                const cashFlow = 
                    stockResponse.data.metric.freeCashFlowPerShareTTM;

                valueValue = await getValue(req.body.ticker, cashFlow);
            }

            let riskValue = 0;

            if (!stockResponse.data.series.annual.currentRatio[0] || 
                !stockResponse.data.series.annual.currentRatio[1]) {
                    riskValue = -1;
            } else {
                const stockRiskYear1 = 
                    stockResponse.data.series.annual.currentRatio[0].v;

                const stockRiskYear2 = 
                    stockResponse.data.series.annual.currentRatio[1].v;

                riskValue = await getRisk(stockRiskYear1, stockRiskYear2);
            }    

            let dividendValue = 0;

            if (!stockResponse.data.metric.dividendYield5Y) {
                dividendValue = -1;
            } else {
                const stockYield = stockResponse.data.metric.dividendYield5Y;
                dividendValue = await getDividend(stockYield);
            }

            const past = await getPast(req.body.ticker);

            const snowflake = {
                value: valueValue,
                past: past,
                future: getFuture(),
                risk: riskValue,
                dividend: dividendValue
            };

            res.status(200).json(snowflake);
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}