import axios from 'axios';

const dividendStock = "OMC";

const SMP500 = "SPX";

export default class SnowflakeService {

    public static async getValue(
        ticker: String,
        cashFlow: number
    ): Promise<number> {

        try {
            const stockQuote = await axios.get(
                `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c5vln0iad3ibtqnna830`);

            if (!stockQuote.data.c) {
                throw new Error("Unable to get the stock price");
            }

            const stockValue = cashFlow;
            const stockCost = stockQuote.data.c;

            let x = (stockValue - stockCost) / stockCost;
            
            let value = 1 / (1 + Math.exp(-x));

            if (value > 1) {
                value = 1;
            } else if (value < 0) {
                value = 0;
            }

            return value;
        } catch (e) {
            return 0;
        }

    }

    public static async getPast(
        ticker: string
    ): Promise<number>{
        try{
            const stockResponse = await axios.get(
              `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=M&from=${Math.floor(Date.now() / 1000 - 31536000)}&to=${Math.floor(Date.now() / 1000)}&token=c5vln0iad3ibtqnna830`);
    
            const stockPrices = Array(stockResponse.data.c)[0];
            const stockGrad = +stockPrices[stockPrices.length-1] - +stockPrices[0];
    
            const index = await axios.get(
                `https://api.twelvedata.com/time_series?symbol=${SMP500}&interval=1month&outputsize=12&apikey=614acd00d55849d19a5fca8f5f6ca17a`);
    
            const indexPrices = index.data.values;
            const indexGrad = +indexPrices[0].close - +indexPrices[indexPrices.length-1].close;
    
            const stockValueGrowth = stockGrad / 
                Number(stockPrices[stockPrices.length-1]) * 100;

            const indexValueGrowth = indexGrad / 
                Number(indexPrices[0].close) * 100;
    
            return +(1/(1+
                Math.exp(-0.05*(stockValueGrowth - indexValueGrowth))))
                .toFixed(3);

        } catch(e)
        {
            return 0;
        }
    }

    public static async getFuture(
        ticker: string
    ): Promise<number>{
        try{
            const stockResponse = await axios.get(
                `https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=c5vln0iad3ibtqnna830`);

            const latestEBIT = 
                Array(stockResponse.data.series.quarterly.ebitPerShare)[0][0].v;
            const scaledEBIT = 0.1*latestEBIT;
            
            return +(1/(1+
                Math.exp(-scaledEBIT))).toFixed(2);
                
        } catch(e)
        {
            return 0;
        }
    }

    public static async getRisk(
        stockRiskYear1: number,
        stockRiskYear2: number
    ): Promise<number> {

        try {        
            let x = (stockRiskYear1 - stockRiskYear2) / stockRiskYear2;
            
            let value = 1 / (1 + Math.exp(x));

            if (value > 1) {
                value = 1;
            } else if (value < 0) {
                value = 0;
            }

            return value;
        } catch (e) {
            return 0;
        }
    }

    public static async getDividend(
        stockYield: number
    ): Promise<number> {

        try {
            const compareResponse = await axios.get(
                `https://finnhub.io/api/v1/stock/metric?symbol=${dividendStock}&metric=all&token=c5vln0iad3ibtqnna830`);


            if (!compareResponse.data.metric.dividendYield5Y) {
                    throw new Error("Unable to determine dividend yield");
            }

            const comparisonYield = compareResponse.data.metric.dividendYield5Y;
            
            let x = (stockYield - comparisonYield) / comparisonYield;

            let value = 1 / (1 + Math.exp(-x));

            if (value > 1) {
                value = 1;
            } else if (value < 0) {
                value = 0;
            }

            return value;
        } catch (e) {
            return 0;
        }
    }
}
