import { Request, Response } from 'express';
import PythonService from '../services/pythonService';
import SnowflakeService from '../services/snowflakeService';
import axios from 'axios';

enum SnowflakeAnalysisIgnore {
    bitcoin = "BINANCE:BTCUSDT",
    ethereum = "BINANCE:ETHUSDT"
};

export default class AnalysisController {
    // this is the controller to get sentiment score
    public static getSentimentScore = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const companyName = req.params.companyName;
            const data = await PythonService.connection("sentimentAnalysis.py", [companyName]);
            const newData = JSON.parse(data);
            res.status(200).json(newData);
        } catch (e) {
            res.status(400).json({ 'error': 'Bad Request' });
        }
    };

    public static snowflake = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            if (req.params.ticker === SnowflakeAnalysisIgnore.bitcoin
                || req.params.ticker === SnowflakeAnalysisIgnore.ethereum) {
                throw new Error('Bad Request');
            }

            const stockResponse = await axios.get(
                `https://finnhub.io/api/v1/stock/metric?symbol=${req.params.ticker}&metric=all&token=c5vln0iad3ibtqnna830`);

            let valueValue = 0;

            if (!stockResponse.data.metric.freeCashFlowPerShareTTM) {
                valueValue = 0;
            } else {
                const cashFlow =
                    stockResponse.data.metric.freeCashFlowPerShareTTM /
                    (1 - 0.05);

                valueValue = await SnowflakeService.getValue(
                    req.params.ticker, cashFlow);
            }

            let riskValue = 0;

            if (!stockResponse.data.series.annual.currentRatio[0] ||
                !stockResponse.data.series.annual.currentRatio[1]) {
                riskValue = 0;
            } else {
                const stockRiskYear1 =
                    stockResponse.data.series.annual.currentRatio[0].v;

                const stockRiskYear2 =
                    stockResponse.data.series.annual.currentRatio[1].v;

                riskValue = await SnowflakeService.getRisk(
                    stockRiskYear1, stockRiskYear2);
            }

            let dividendValue = 0;

            if (!stockResponse.data.metric.dividendYield5Y) {
                dividendValue = 0;
            } else {
                const stockYield = stockResponse.data.metric.dividendYield5Y;
                dividendValue = await SnowflakeService.getDividend(stockYield);
            }

            const futureValue = await SnowflakeService.getFuture(
                req.params.ticker
            );
            const pastValue = await SnowflakeService.getPast(req.params.ticker);

            const snowflake = {
                value: valueValue,
                past: pastValue,
                future: futureValue,
                risk: riskValue,
                dividend: dividendValue
            };

            res.status(200).json(snowflake);
        } catch (e) {
            res.status(400).json({ 'error': 'Bad Request' });
        }
    };
}
