import React from 'react';
import { TickerItem, Symbol } from '../styles/watchlist.style';

interface Props {
    symbol: string,
    stockName: string,
}

const WatchlistTicker: React.FC<Props> = ({ symbol, stockName }) => {
    return (
        <TickerItem>
            <Symbol>{symbol}</Symbol>
            <p>{stockName}</p>
        </TickerItem>
    );
};

export default WatchlistTicker;
