import React from 'react';
import { Main } from '../styles/analysis.style';

interface Props {
    ticker: string,
    stockName: string,
}

const Analysis: React.FC<Props> = ({ ticker, stockName }) => {
    return (
        <Main>
            Sentiment Score
        </Main>
    );
};

export default Analysis;
