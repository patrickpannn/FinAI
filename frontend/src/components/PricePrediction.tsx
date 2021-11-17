import React, { useState, useEffect, useCallback } from 'react';
import { Line } from "react-chartjs-2";
import { useStyles } from '../styles/analysis.style';
import Prices from './testing.json';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {
    ticker: string,
}

const PricePrediction: React.FC<Props> = ({ ticker }) => {
    const styles = useStyles();
    const [dates, setDates] = useState<string[]>();
    const [prices, setPrices] = useState<number[]>();

    const fetchPrices = useCallback(async (): Promise<void> => {
        const newDates = [];
        const newPrices = [];
        for (const [date, price] of Object.entries(Prices.Close)) {
            const tmpDate = new Date(date);
            newDates.push(`${tmpDate.getMonth() + 1}-${tmpDate.getDate()}`);
            newPrices.push(price);
        }
        setDates(newDates);
        setPrices(newPrices);
    }, []);

    useEffect(() => {
        fetchPrices();
    }, [fetchPrices]);

    const data = {
        labels: dates,
        datasets: [
            {
                label: "Price Prediction",
                data: prices,
                fill: false,
                borderColor: "#072bee",
            }
        ]
    };

    return (
        <div className={`${styles.box}`}>
            <h1>Stock Price Prediction</h1>
            {prices === undefined
                ? <div className={styles.progressBar}><CircularProgress /></div>
                : <Line data={data} />
            }
        </div>
    );
};

export default PricePrediction;
