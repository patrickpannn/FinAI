import { Request, Response } from 'express';

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
                health: getHealth(),
                dividend: getDividend()
            }
            res.status(200).json(snowflake);
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}

function getValue() {
    return 0.1;
}

function getPast() {
    return 0.2;
}

function getFuture() {
    return 0.3;
}

function getHealth() {
    return 0.8;
}

function getDividend() {
    return 0.6;
}