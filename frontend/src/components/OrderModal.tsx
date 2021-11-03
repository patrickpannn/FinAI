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

const OrderModal: React.FC<Props> = ({ open, onClose }) => {
    const [units, setUnits] = useState<number>(0);
    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        try {
            if (units <= 0) {
                console.log(units);
                throw new Error('Units should be positive');
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
                        type="number"
                        value={units}
                        onChange={
                            (e): void => setUnits(parseInt(e.target.value, 10))
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