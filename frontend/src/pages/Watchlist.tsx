import React, { useEffect } from 'react';
import { Main, LeftBar, RightContent, WatchlistTitle } from '../styles/watchlist.style';
import WatchlistTicker from '../components/WatchlistTicker';
import Stock from '../components/Stock';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';

const Watchlist: React.FC = () => {

    const fetchTickers = async (): Promise<void> => {


    };

    useEffect(() => {
    }, [])
    return (
        <Main>
            <LeftBar>
                <WatchlistTitle>
                    <h2>My Watchlist</h2>
                </WatchlistTitle>
                <WatchlistTicker symbol='AAPL' stockName='apple' />
                <WatchlistTicker symbol='AMZN' stockName='amazon'/>
            </LeftBar>
            <RightContent>
                <Stock />
            </RightContent>
        </Main>
    );
};

export default Watchlist;
