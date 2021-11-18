import React from 'react';
import { Main } from '../styles/analysis.style';
import SentimentAnalysis from './SentimentAnalysis';
import SnowFlake from './SnowFlake';
interface Props {
    ticker: string,
    stockName: string,
}

const Analysis: React.FC<Props> = ({ ticker, stockName }) => {
    return (
        <Main>
            <SentimentAnalysis stockName={stockName} />
            {!(ticker === 'BINANCE:BTCUSDT' || ticker === 'BINANCE:ETHUSDT') && <SnowFlake ticker={ticker}/>}
        </Main>
    );
};

export default Analysis;
