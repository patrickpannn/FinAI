import { Request, Response } from 'express';
import PythonService from '../services/pythonService';
import SnowflakeService from '../services/snowflakeService';
import axios from 'axios';

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

            if (Object.keys(req.params).length !== 1 || !req.params.ticker) {
                throw new Error('Incorrect inputs given');
            }

            const stockResponse = await axios.get(
                `https://finnhub.io/api/v1/stock/metric?symbol=${req.params.ticker}&metric=all&token=c5vln0iad3ibtqnna830`);
            
            let valueValue = 0;

            if (!stockResponse.data.metric.freeCashFlowPerShareTTM) {
                valueValue = -1;
            } else {
                const cashFlow = 
                    stockResponse.data.metric.freeCashFlowPerShareTTM;

                valueValue = await SnowflakeService.getValue(
                                            req.params.ticker, cashFlow);
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

                riskValue = await SnowflakeService.getRisk(
                                        stockRiskYear1, stockRiskYear2);
            }    

            let dividendValue = 0;

            if (!stockResponse.data.metric.dividendYield5Y) {
                dividendValue = -1;
            } else {
                const stockYield = stockResponse.data.metric.dividendYield5Y;
                dividendValue = await SnowflakeService.getDividend(stockYield);
            }

            const snowflake = {
                value: valueValue,
                past: await SnowflakeService.getPast(),
                future: await SnowflakeService.getFuture(),
                risk: riskValue,
                dividend: dividendValue
            };

            res.status(200).json(snowflake);
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}