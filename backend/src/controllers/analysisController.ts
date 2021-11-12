import { Request, Response } from 'express';
import PythonService from '../services/pythonService';

export default class AnalysisController {

    // this is the controller for demo
    public static testing = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const data = await PythonService.connection("testing.py", ["apple inc"]);
            res.json(data);
        } catch (e) {
            res.status(400).json({ 'error': 'Bad Request' });
        }
    };
}