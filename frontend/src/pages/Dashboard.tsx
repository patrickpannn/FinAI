import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Topup from '../components/Topup';
import UpdateProfile from '../components/UpdateProfile';
import Watchlist from './Watchlist';
import { Route } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';

const Dashboard: React.FC = () => {
    const [topupOpen, setTopupOpen] = useState(false);
    const [updateProfileOpen, setUpdateProfileOpen] = useState(false);
    const [searchTicker, setSearchTicker] = useState('');
    const [searchStockName, setSearchStockName] = useState('');
    const socketRef = React.useRef<Socket>();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);

    const handleSearch = (ticker: string, stockName: string): void => {
        setSearchTicker(ticker);
        setSearchStockName(stockName);
    };

    useEffect((): (() => void) => {
        socketRef.current = io('http://localhost:5000');
        const socket = socketRef.current;

        socket.emit('join', { token: sessionStorage.getItem('access_token') }, (error: Error) => {
            if (error) {
                setToast({ type: 'error', message: `${error}` });
            }
        });

        socket.on('notification', (msg) => {
            setToast({ type: 'success', message: `${msg}` });
        });

        return (): void => {
            socket.disconnect();
        };
    // eslint-disable-next-line
    }, []);

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
            <Topup open={topupOpen} onClose={(): void => setTopupOpen(false)} />
            <UpdateProfile
                open={updateProfileOpen}
                onClose={(): void => setUpdateProfileOpen(false)}
            />
        </main>
    );
};

export default Dashboard;
