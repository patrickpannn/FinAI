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
    onClose: () => void;
}

const Topup: React.FC<Props> = ({ open, onClose }) => {
    const [amount, setAmount] = useState<number>();
    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        try {
            if (amount === undefined || amount <= 0) {
                throw new Error('Invalid Amount');
            }
            const response = await fetch(`${url}/user/changeBalance`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    value: amount,
                }),
            });
            if (response.status === 200) {
                setToast({ type: 'success', message: `Deposit successfully` });
                onClose();
            } else if (response.status === 401) {
                throw new Error('Authentication Failed');
            } else {
                throw new Error('Bad Request');
            }
        } catch (error) {
            setToast({ type: 'error', message: `${error}` });
        }
    };

    return (
        <BootstrapDialog
            aria-labelledby="topup"
            open={open}
        >
            <StyledDialogTitle id="topup-title" onClose={onClose}>
                Top-up
            </StyledDialogTitle>
            <DialogContent className={styles.container} dividers>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <TextField
                        id="outlined-number"
                        label="Deposit Amount"
                        type="number"
                        value={amount}
                        onChange={
                            (e): void => setAmount(parseInt(e.target.value, 10))
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
export default Topup;