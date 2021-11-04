import React, { useEffect, useState } from 'react';
import { Main, LeftBar, RightContent, WatchlistTitle, TabContainer, useStyles, StyledTabs, StyledTab } from '../styles/watchlist.style';
import WatchlistTicker from '../components/WatchlistTicker';
import Stock from '../components/Stock';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';

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

type TabsType = 'SUMMARY' | 'NEWS' | 'ANALYSIS';

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
    const [tab, setTab] = React.useState<TabsType>('SUMMARY');

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
                const newData: StockInterface[] = data.map((
                    val: StockInterface,
                    idx: number
                ) => {
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
                    setTab('SUMMARY');
                    if (newData.find(val => val.ticker === searchTicker)) {
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
                    ? <div className={styles.noTickers}>
                        <h1>
                            Currently you don't have Tickers in the Watchlist
                        </h1>
                    </div>
                    : <>
                        {tab === 'SUMMARY' && <Stock
                            ticker={currentTicker}
                            stockName={currentStockName}
                            inWatchlist={inWatchlist}
                            removeFromWatchlist={removeFromWatchlist}
                            addToWatchlist={addToWatchlist}
                        />}
                        <TabContainer>
                            <StyledTabs
                                aria-label="tabs"
                            >
                                <StyledTab
                                    className={`${tab === 'SUMMARY' && styles.selected}`}
                                    onClick={(): void => setTab('SUMMARY')}>
                                    SUMMARY
                                </StyledTab>
                                <StyledTab
                                    className={`${tab === 'NEWS' && styles.selected}`}
                                    onClick={(): void => setTab('NEWS')} >
                                    NEWS
                                </StyledTab>
                                <StyledTab
                                    className={`${tab === 'ANALYSIS' && styles.selected}`}
                                    onClick={(): void => setTab('ANALYSIS')}>
                                    ANALYSIS
                                </StyledTab>
                            </StyledTabs>
                        </TabContainer>
                    </>
                }
            </RightContent>
        </Main>
    );
};

export default Watchlist;
