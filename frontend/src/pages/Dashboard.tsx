import React, { useState } from 'react';
import Header from '../components/Header';
import Topup from '../components/Topup';
import UpdateProfile from '../components/UpdateProfile';

const Dashboard: React.FC = () => {
    const [topupOpen, setTopupOpen] = useState(false);
    const [updateProfileOpen, setUpdateProfileOpen] = useState(false);

    return (
        <div>
            <Header
                page='DASHBOARD'
                openTopupModal={(): void => setTopupOpen(true)}
                openUpdateModal={(): void => setUpdateProfileOpen(true)}
            />
            <Topup open={topupOpen} onClose={(): void => setTopupOpen(false)} />
            <UpdateProfile
                open={updateProfileOpen}
                onClose={(): void => setUpdateProfileOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
