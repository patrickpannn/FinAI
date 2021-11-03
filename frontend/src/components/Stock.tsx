
import React, { useState, useEffect } from 'react';
import { Main, Title, Banner, useStyles, BuyBtn, ButtonGroup } from '../styles/stock.style';
import StockChart from './StockChart';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { IconButton } from '@mui/material';
import OrderModal from './OrderModal';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import CircularProgress from '@mui/material/CircularProgress';

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
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const [price, setPrice] = useState(0);

    const handleAddTicker = (): void => {
        if (inWatchlist) {
            removeFromWatchlist(ticker);
        } else {
            addToWatchlist(ticker, stockName);
        }
    };

    const fetchPrice = async (): Promise<void> => {
        try {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c5vln0iad3ibtqnna830`, {
                method: 'GET',
            });

            if (response.status === 200) {
                const stockData = await response.json();
                setPrice(stockData.c);
            } else {
                throw new Error('Failed to fetch the price');
            }

        } catch (e) {
            setToast({ type: 'error', message: `${e}` });
        }
    };

    useEffect(() => {
        fetchPrice();
    // eslint-disable-next-line
    }, [ticker]);

    return (
        <Main>
            <Title>
                <h1>{stockName}</h1>
            </Title>
            <Banner>
                {price === 0
                    ? <h1><CircularProgress /></h1>
                    : <h1>${price}</h1>
                }
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
