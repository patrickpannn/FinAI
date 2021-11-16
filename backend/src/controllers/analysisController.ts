import { Request, Response } from 'express';
import PythonService from '../services/pythonService';

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
}