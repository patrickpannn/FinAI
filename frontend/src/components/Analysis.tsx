import React from 'react';
import { Main } from '../styles/analysis.style';
import SentimentAnalysis from './SentimentAnalysis';

interface Props {
    ticker: string,
    stockName: string,
}

const Analysis: React.FC<Props> = ({ ticker, stockName }) => {
    return (
        <Main>
            <SentimentAnalysis />
        </Main>
    );
};

export default Analysis;
