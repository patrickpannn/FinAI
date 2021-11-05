import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Main, Title, Banner, useStyles, BuyBtn, ButtonGroup } from '../styles/stock.style';
import StockChart from './StockChart';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { IconButton } from '@mui/material';
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

type Color = 'normal' | 'up' | 'down';

const Stock: React.FC<Props> = ({
    ticker,
    stockName,
    inWatchlist,
    removeFromWatchlist,
    addToWatchlist
}) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const [price, setPrice] = useState(0);
    const [priceColor, setPriceColor] = useState<Color>('normal');
    const socket = useRef<WebSocket>();

    const handleAddTicker = (): void => {
        if (inWatchlist) {
            removeFromWatchlist(ticker);
        } else {
            addToWatchlist(ticker, stockName);
        }
    };

    const fetchPrice = useCallback(async (): Promise<void> => {
        if (ticker !== 'BINANCE:BTCUSDT' && ticker !== 'BINANCE:ETHUSDT') {
            try {
                if (ticker) {
                    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c5vln0iad3ibtqnna830`, {
                        method: 'GET',
                    });

                    if (response.status === 200) {
                        const stockData = await response.json();
                        setPrice(stockData.c);
                        setPriceColor('normal');
                    } else {
                        throw new Error('Failed to fetch the price');
                    }
                }

            } catch (e) {
                setToast({ type: 'error', message: `${e}` });
            }
        }
        // eslint-disable-next-line
    }, [ticker]);


    useEffect(() => {
        if (ticker === 'BINANCE:BTCUSDT' || ticker === 'BINANCE:ETHUSDT') {
            socket.current = new WebSocket('wss://ws.finnhub.io?token=c5vln0iad3ibtqnna830');

            // Connection opened -> Subscribe
            socket.current.onopen = function (event): void {
                if (!socket.current) return;
                socket.current.send(JSON.stringify({ 'type': 'subscribe', 'symbol': ticker }));

            };

            const wsCurrent = socket.current;

            wsCurrent.onmessage = (e): void => {
                const response = JSON.parse(e.data);
                if (response.data) {
                    const newPrice = response.data[0].p;
                    setPrice(prev => {
                        if (prev === newPrice) {
                            setPriceColor('normal');
                        } else if (prev < newPrice) {
                            setPriceColor('up');
                        } else {
                            setPriceColor('down');
                        }
                        return newPrice;
                    });
                }
            };
            return (): void => {
                // close connection
                wsCurrent.close();
            };
        } else {
            fetchPrice();
        }
    }, [ticker, fetchPrice]);

    return (
        <Main>
            <Title>
                <h1>{stockName}</h1>
            </Title>
            <Banner>
                {price === 0
                    ? <h1><CircularProgress /></h1>
                    : <h1 className={styles[priceColor]}>${price}</h1>
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
                >
                    Buy Shares
                </BuyBtn>
            </ButtonGroup>
            <StockChart ticker={ticker} />
        </Main>
    );
};

export default Stock;
