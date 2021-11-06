import React from 'react';
import {
    Box,
    Drawer,
    List,
    Divider,
    Stack,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    Avatar,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CreateIcon from '@mui/icons-material/Create';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { useHistory } from 'react-router-dom';
import { DialogContent, LargeButton, useStyles } from '../styles/sideBar.style';
import SidebarBtn from './SidebarBtn';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';

interface Props {
    open: boolean,
    onClose: () => void,
    openTopupModal?: () => void,
    openUpdateModal?: () => void,
    openOrders?: () => void
}

const Sidebar: React.FC<Props> = ({
    open,
    onClose,
    openTopupModal,
    openUpdateModal,
    openOrders
}) => {
    const [deleteAcDialog, setDeleteAcDialog] = React.useState(false);
    const history = useHistory();
    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);


    const handleLogout = async (): Promise<void> => {
        try {
            const response = await fetch(`${url}/user/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                },
            });
            const data = await response.json();
            if (response.status === 200) {
                setToast({ type: 'success', message: `${data.response}` });
                sessionStorage.setItem('access_token', '');
                history.push('/');
            } else {
                throw new Error(`${data.error}`);
            }
        } catch (error) {
            setToast({ type: 'error', message: `${error}` });
        }
    };

    const handleDeleteAccount = async (): Promise<void> => {
        try {
            const response = await fetch(`${url}/user/deleteAccount`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                },
            });
            const data = await response.json();
            if (response.status === 200) {
                setToast({ type: 'success', message: 'Delete Successfully' });
                sessionStorage.setItem('access_token', '');
                history.push('/');
            } else {
                throw new Error(`${data.error}`);
            }
        } catch (error) {
            setToast({ type: 'error', message: `${error}` });
        }
    };

    return (
        <>
            <Drawer anchor={'right'} open={open} onClose={onClose}>
                <Box
                    className={styles.sideBar}
                    role="presentation"
                    onClick={onClose}
                    onKeyDown={onClose}
                >
                    <div className={styles.userInfo}>
                        <Avatar sx={{ width: 32, height: 32 }}>J</Avatar>
                        <h1 className={styles.username}>John</h1>
                    </div>
                    <Stack className={styles.topup} direction="row">
                        <LargeButton
                            variant='contained'
                            type='button'
                            onClick={openTopupModal}
                        >
                            Top-Up
                        </LargeButton>
                    </Stack>
                    <Stack className={styles.menuLabel} direction="row">
                        MENU
                    </Stack>
                    <List>
                        <SidebarBtn
                            text='Watchlist'
                            onClick={(): void => history.push('/dashboard')}
                            childNode={
                                <ShowChartIcon className={styles.btnColor} />
                            }
                        />
                        <SidebarBtn
                            text='Portfolios'
                            onClick={(): void => console.log('portfolio')}
                            childNode={
                                <BarChartIcon className={styles.btnColor} />
                            }
                        />
                        <SidebarBtn
                            text='Wallet'
                            onClick={(): void => console.log('wallet')}
                            childNode={
                                <AccountBalanceWalletIcon
                                    className={styles.btnColor}
                                />
                            }
                        />
                        <SidebarBtn
                            text='Orders'
                            onClick={(): void => history.push('/dashboard/orderhistory')}
                            childNode={
                                <ListAltIcon className={styles.btnColor} />
                            }
                        />
                        <SidebarBtn
                            text='Update Profile'
                            onClick={openUpdateModal}
                            childNode={
                                <CreateIcon className={styles.btnColor} />
                            }
                        />
                        <Divider />
                        <SidebarBtn
                            text='Logout'
                            onClick={handleLogout}
                            childNode={
                                <LogoutIcon className={styles.btnColor} />
                            }
                        />
                        <SidebarBtn
                            text='Delete Account'
                            onClick={(): void => setDeleteAcDialog(true)}
                            childNode={
                                <DeleteForeverIcon
                                    className={styles.btnColor}
                                />
                            }
                        />
                    </List>
                </Box>
            </Drawer>
            <Dialog
                open={deleteAcDialog}
                aria-labelledby="delete-account"
            >
                <DialogTitle id="delete-account">
                    <DialogContent>
                        Are you sure to delete your account?
                    </DialogContent>
                </DialogTitle>
                <DialogActions>
                    <Button
                        onClick={(): void => setDeleteAcDialog(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteAccount} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Sidebar;
