import React from 'react';
import { TickerItem, Symbol, useStyles, StockName } from '../styles/watchlist.style';

interface Props {
    symbol: string,
    stockName: string,
    selected: boolean,
    selectTicker(): void;
}
// The style for left hand watchlist item
const WatchlistTicker: React.FC<Props> = ({
    symbol,
    stockName,
    selected,
    selectTicker
}) => {
    const styles = useStyles();
    return (
        <TickerItem
            className={`${selected && styles.selected}`}
            onClick={selectTicker}
        >
            <Symbol>{symbol}</Symbol>
            <StockName>{stockName}</StockName>
        </TickerItem>
    );
};

export default WatchlistTicker;
