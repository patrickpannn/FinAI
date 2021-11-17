import React from 'react';
import { Main } from '../styles/analysis.style';
import SentimentAnalysis from './SentimentAnalysis';
import PricePrediction from './PricePrediction';

interface Props {
    ticker: string,
    stockName: string,
}

const Analysis: React.FC<Props> = ({ ticker, stockName }) => {
    return (
        <Main>
            <SentimentAnalysis stockName={stockName} />
            <PricePrediction ticker={ticker} />
        </Main>
    );
};

export default Analysis;
