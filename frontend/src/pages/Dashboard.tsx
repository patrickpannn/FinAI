import React, { useState } from 'react';
import Header from '../components/Header';
import Topup from '../components/Topup';
import UpdateProfile from '../components/UpdateProfile';
import Watchlist from './Watchlist';
import { Route } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const [topupOpen, setTopupOpen] = useState(false);
    const [updateProfileOpen, setUpdateProfileOpen] = useState(false);
    return (
        <main>
            <Header
                page='DASHBOARD'
                openTopupModal={(): void => setTopupOpen(true)}
                openUpdateModal={(): void => setUpdateProfileOpen(true)}
            />
            <Route exact path="/dashboard">
                <Watchlist />
            </Route>
            <Route path="/dashboard/watchlist/:ticker">
                <Watchlist />
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
