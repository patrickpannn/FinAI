import React, { useState } from 'react';
import { DialogContent, DialogActions, TextField } from '@mui/material';
import { BootstrapDialog, useStyles, SubmitButton } from '../styles/dialog.style';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import StyledDialogTitle from './StyledDialogTitle';
import { TabContainer, StyledTabs, StyledTab } from '../styles/watchlist.style';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';

interface Props {
    open: boolean,
    ticker: string,
    stockName: string,
    onClose: () => void;
}

const OrderModal: React.FC<Props> = ({ open, ticker, stockName, onClose }) => {
    const [units, setUnits] = useState('');
    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const [page, setPage] = useState('BUY NOW');
    const [amount, setAmount] = useState('');

    const handleNormal = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        try {
            if (!parseInt(units, 10)) {
                console.log(units);
                throw new Error('Please enter numbers');
            } else if (+units <= 0) {
                throw new Error('Units should be positive');
            }

            const response = await fetch(`${url}/user/order/buyMarketOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    units: units,
                    portfolio: 'Default',
                    ticker: ticker,
                    name: stockName
                }),
            });
            if (response.status === 200) {
                setToast({ type: 'success', message: `Order Executed!` });
                onClose();
            } else if (response.status === 401) {
                throw new Error('Authentication Failed');
            } else {
                throw new Error('Insufficient funds');
            }
        } catch (error) {
            setToast({ type: 'error', message: `${error}` });
        }
    };

    const handleLimit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        try {
            if (!parseInt(units, 10) || !parseInt(amount, 10)) {
                console.log(units);
                console.log(amount);
                throw new Error('Please enter numbers');
            } else if (+units <= 0) {
                throw new Error('Units should be positive');
            }

            const response = await fetch(`${url}/user/order/buyLimitOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    units: units,
                    price: amount, 
                    portfolio: 'Default',
                    ticker: ticker,
                    name: stockName
                }),
            });
            if (response.status === 200) {
                setToast({ type: 'success', message: `Order Executed!` });
                onClose();
            } else if (response.status === 401) {
                throw new Error('Authentication Failed');
            } else {
                throw new Error('Insufficient funds');
            }
        } catch (error) {
            setToast({ type: 'error', message: `${error}` });
        }
    };

    return (
        <BootstrapDialog
            aria-labelledby="buy order"
            open={open}
        >
            { page === 'BUY NOW' && <>
            <StyledDialogTitle id="buy-title" onClose={onClose}>
                Buy Now
            </StyledDialogTitle>
            <DialogContent className={styles.container} dividers>
                <form onSubmit={handleNormal} className={styles.form}>
                    <TextField
                        id="outlined-number"
                        label="Units"
                        type="text"
                        value={units}
                        onChange={
                            (e): void => setUnits(e.target.value)
                        }
                        required
                        fullWidth
                    />
                    <DialogActions>
                        <SubmitButton autoFocus type='submit' variant="contained">
                            Place buy Order
                        </SubmitButton>
                    </DialogActions>
                </form>
            </DialogContent>

            <TabContainer>
                <StyledTabs
                    aria-label="tabs"
                >
                    <StyledTab
                        className = {`${page === 'BUY NOW' && styles.selected}`}
                        onClick={(): void => setPage('BUY NOW')} >
                        BUY NOW
                    </StyledTab>
                    <StyledTab
                        onClick={(): void => setPage('LIMIT ORDER')} >
                        BUY LIMIT ORDER
                    </StyledTab>
                </StyledTabs>
            </TabContainer>
            </>
            }
            { page === 'LIMIT ORDER' && 
            <>
            <StyledDialogTitle id="buy-title" onClose={onClose}>
                Limit Order
            </StyledDialogTitle>
            <DialogContent className={styles.container} dividers>
                <form onSubmit={handleLimit} className={styles.form}>
                    <TextField
                        label="Expected Price"
                        type="text"
                        value={amount}
                        onChange={
                            (e): void => setAmount(e.target.value)
                        }
                        required
                        fullWidth
                    />
                    <TextField
                        label="Units"
                        type="text"
                        value={units}
                        onChange={
                            (e): void => setUnits(e.target.value)
                        }
                        required
                        fullWidth
                    />
                    <DialogActions>
                        <SubmitButton autoFocus type='submit' variant="contained">
                            Place Limit Order
                        </SubmitButton>
                    </DialogActions>
                </form>
            </DialogContent>
                <TabContainer>
                <StyledTabs
                    aria-label="tabs"
                >
                    <StyledTab
                        onClick={(): void => setPage('BUY NOW')} >
                        BUY NOW
                    </StyledTab>
                    <StyledTab
                        className = {`${page === 'LIMIT ORDER' && styles.selected}`}
                        onClick={(): void => setPage('BUY LIMIT ORDER')} >
                        BUY LIMIT ORDER
                    </StyledTab>
                </StyledTabs>
            </TabContainer>
            </>}
        </BootstrapDialog>
    );
};
export default OrderModal;