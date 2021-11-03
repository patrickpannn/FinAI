import React, { useEffect, useState } from 'react';
import { Main, LeftBar, RightContent, WatchlistTitle, TabContainer, useStyles } from '../styles/watchlist.style';
import WatchlistTicker from '../components/WatchlistTicker';
import Stock from '../components/Stock';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';

interface StockInterface {
    ticker: string,
    stockName: string,
    selected: boolean,
}

interface Props {
    searchTicker: string,
    searchStockName: string,
}

const Watchlist: React.FC<Props> = ({
    searchTicker,
    searchStockName
}) => {
    const styles = useStyles();
    const [tickers, setTickers] = useState<StockInterface[]>([]);
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const [currentTicker, setCurrentTicker] = useState('');
    const [currentStockName, setCurrentStockName] = useState('');
    const [inWatchlist, setInWatchlist] = useState(false);
    const [tab, setTab] = React.useState('Summary');

    const handleTab = (event: React.SyntheticEvent, newValue: string): void => {
        setTab(newValue);
    };

    const handleSelected = (index: number): void => {
        let newTickers: StockInterface[] = [...tickers];
        newTickers = newTickers.map((val, idx) => {
            if (idx === index) {
                val.selected = true;
                setCurrentStockName(val.stockName);
                setCurrentTicker(val.ticker);
                setInWatchlist(true);
            } else {
                val.selected = false;
            }
            return val;
        });
        setTickers(newTickers);
    };

    const addToWatchlist = async (
        ticker: string,
        stockName: string
    ): Promise<void> => {
        try {
            const response = await fetch(`${url}/user/watchlist/${ticker}/${stockName}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
                }
            });

            if (response.status === 200) {
                const newStock: StockInterface = {
                    ticker: ticker,
                    stockName: stockName,
                    selected: true,
                };
                setTickers([newStock, ...tickers]);
                setInWatchlist(true);
                setToast({ type: 'success', message: 'Add to watchlist' });
            } else {
                throw new Error('Ticker alreay exists in watchlist');
            }
        } catch (e) {
            setToast({ type: 'error', message: `${e}` });
        }
    };

    const removeFromWatchlist = async (ticker: string): Promise<void> => {
        try {
            const response = await fetch(`${url}/user/watchlist/${ticker}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
                }
            });
            if (response.status === 200) {
                const newTickers = tickers.filter((val) =>
                    val.ticker !== ticker
                );
                setInWatchlist(false);
                setTickers(newTickers);
                setToast({ type: 'warning', message: 'Remove from watchlist' });
            } else {
                throw new Error('Ticker does not exist in your watchlist');
            }
        } catch (e) {
            setToast({ type: 'error', message: `${e}` });
        }
    };

    const fetchTickers = async (): Promise<void> => {
        try {
            const response = await fetch(`${url}/user/watchlist`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                const newData = data.map((val: StockInterface, idx: number) => {
                    if (idx === 0 && !searchTicker) {
                        val.selected = true;
                    } else {
                        val.selected = false;
                    }
                    return val;
                });

                setTickers(newData);
                if (searchTicker && searchStockName) {
                    setCurrentTicker(searchTicker);
                    setCurrentStockName(searchStockName);
                    if (tickers.find(val => val.ticker === searchTicker)) {
                        setInWatchlist(true);
                    } else {
                        setInWatchlist(false);
                    }
                } else if (newData.length !== 0) {
                    setCurrentTicker(newData[0].ticker);
                    setCurrentStockName(newData[0].stockName);
                    setInWatchlist(true);
                }
            } else {
                throw new Error('Failed to fetch watchlist');
            }
        } catch (e) {
            setToast({ type: 'error', message: `${e}` });

        }
    };

    useEffect(() => {
        fetchTickers();
        // eslint-disable-next-line
    }, [searchTicker, searchStockName]);

    return (
        <Main>
            <LeftBar>
                <WatchlistTitle>
                    <h2>My Watchlist</h2>
                </WatchlistTitle>
                {tickers.map((val, idx) => {
                    const selectTicker = (): void => {
                        handleSelected(idx);
                    };
                    return <WatchlistTicker
                        key={idx}
                        symbol={val.ticker}
                        stockName={val.stockName}
                        selected={val.selected}
                        selectTicker={selectTicker}
                    />;
                })}
            </LeftBar>
            <RightContent>
                {tickers.length === 0 && !searchTicker
                    ? <h1>No Tickers</h1>
                    : <>
                        <TabContainer>
                            <Tabs
                                value={tab}
                                onChange={handleTab}
                                variant="fullWidth"
                                aria-label="tabs"
                            >
                                <Tab value="Summary" label="Summary" className={styles.tab} />
                                <Tab value="News" label="News" className={styles.tab} />
                                <Tab value="Analysis" label="Analysis" className={styles.tab} />
                            </Tabs>
                        </TabContainer>

                        {tab === 'Summary' && <Stock
                            ticker={currentTicker}
                            stockName={currentStockName}
                            inWatchlist={inWatchlist}
                            removeFromWatchlist={removeFromWatchlist}
                            addToWatchlist={addToWatchlist}
                        />}
                    </>
                }
            </RightContent>
        </Main>
    );
};

export default Watchlist;
