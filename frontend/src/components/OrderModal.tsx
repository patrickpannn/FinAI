import React, { useState } from 'react';
import { DialogContent, DialogActions, TextField } from '@mui/material';
import { BootstrapDialog, useStyles, SubmitButton } from '../styles/dialog.style';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import StyledDialogTitle from './StyledDialogTitle';

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

    const handleSubmit = async (
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

    return (
        <BootstrapDialog
            aria-labelledby="buy order"
            open={open}
        >
            <StyledDialogTitle id="buy-title" onClose={onClose}>
                BUY
            </StyledDialogTitle>
            <DialogContent className={styles.container} dividers>
                <form onSubmit={handleSubmit} className={styles.form}>
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
                            Confirm
                        </SubmitButton>
                    </DialogActions>
                </form>
            </DialogContent>
        </BootstrapDialog>
    );
};
export default OrderModal;