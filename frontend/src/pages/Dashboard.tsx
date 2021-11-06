import React, { useState } from 'react';
import Header from '../components/Header';
import Topup from '../components/Topup';
import UpdateProfile from '../components/UpdateProfile';
import Watchlist from './Watchlist';
import { Route } from 'react-router-dom';
import Orders from '../pages/Orders';

const Dashboard: React.FC = () => {
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
            />
            <Route exact path="/dashboard">
                <Watchlist
                    searchTicker={searchTicker}
                    searchStockName={searchStockName}
                />
            </Route>
            <Route exact path="/dashboard/orderhistory">
                <Orders />
             </Route>
            <Topup open={topupOpen} onClose={(): void => setTopupOpen(false)} />
            <UpdateProfile
                open={updateProfileOpen}
                onClose={(): void => setUpdateProfileOpen(false)}
            />
        </main>
    );
};

export default Dashboard;
