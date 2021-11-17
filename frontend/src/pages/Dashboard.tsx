import React, { useState } from 'react';
import Header from '../components/Header';
import Topup from '../components/Topup';
import UpdateProfile from '../components/UpdateProfile';
import Watchlist from './Watchlist';
import { Route } from 'react-router-dom';
import Wallet from '../pages/Wallet';

interface Props {
    updateLogin: (val: boolean) => void,
}

const Dashboard: React.FC<Props> = ({ updateLogin }) => {
    const [topupOpen, setTopupOpen] = useState(false);
    const [updateProfileOpen, setUpdateProfileOpen] = useState(false);
    const [searchTicker, setSearchTicker] = useState('');
    const [searchStockName, setSearchStockName] = useState('');

    const handleSearch = (ticker: string, stockName: string): void => {
        setSearchTicker(ticker);
        setSearchStockName(stockName);
    };
 
    return (
        <main>
            <Header
                page='DASHBOARD'
                openTopupModal={(): void => setTopupOpen(true)}
                openUpdateModal={(): void => setUpdateProfileOpen(true)}
                handleSearch={handleSearch}
                updateLogin={updateLogin}
            />
            <Route exact path="/dashboard">
                <Watchlist
                    searchTicker={searchTicker}
                    searchStockName={searchStockName}
                />
            </Route>
            <Route exact path="/dashboard/balance">
                  <Wallet />
             </Route>
            <Topup open={topupOpen} onClose={(): void => setTopupOpen(false)} />
            <UpdateProfile
                open={updateProfileOpen}
                onClose={(): void => setUpdateProfileOpen(false)}
                updateLogin={updateLogin}
            />
        </main>
    );
};

export default Dashboard;
