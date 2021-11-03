import React, { useState } from 'react';
import { Main, Title, Banner, useStyles, BuyBtn, ButtonGroup } from '../styles/stock.style';
import StockChart from './StockChart';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { IconButton } from '@mui/material';
import OrderModal from './OrderModal';

interface Props {
    ticker: string,
    stockName: string,
    inWatchlist: boolean,
    removeFromWatchlist(ticker: string): Promise<void>,
    addToWatchlist(ticker: string, stockName: string): Promise<void>,
}

const Stock: React.FC<Props> = ({
    ticker,
    stockName,
    inWatchlist,
    removeFromWatchlist,
    addToWatchlist
}) => {
    const styles = useStyles();
    const [buyOpen, setBuyOpen] = useState(false);

    const handleAddTicker = (): void => {
        if (inWatchlist) {
            removeFromWatchlist(ticker);
        } else {
            addToWatchlist(ticker, stockName);
        }
    };

    return (
        <Main>
            <Title>
                <h1>{stockName}</h1>
            </Title>
            <Banner>
                <h1>$148.96</h1>
                <IconButton
                    aria-label="add to watchlist"
                    onClick={handleAddTicker}
                    type='button'
                >
                    {inWatchlist
                        ? <StarIcon fontSize='large' className={styles.selected} />
                        : <StarOutlineIcon fontSize='large' className={styles.unselected} />
                    }
                </IconButton>
            </Banner>
            <ButtonGroup>
                <BuyBtn
                    variant="contained"
                    type='button'
                    onClick={(): void => setBuyOpen(true)}
                >
                    Buy Shares
                </BuyBtn>
            </ButtonGroup>
            <StockChart ticker={ticker} />
            <OrderModal
                ticker={ticker}
                stockName={stockName}
                open={buyOpen}
                onClose={(): void => setBuyOpen(false)}
            />
        </Main>
    );
};

export default Stock;
