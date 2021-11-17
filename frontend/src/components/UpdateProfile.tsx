import React, { useState } from 'react';
import { TextField, DialogContent, DialogActions } from '@mui/material';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { BootstrapDialog, useStyles, SubmitButton } from '../styles/dialog.style';
import { useHistory } from 'react-router-dom';
import StyledDialogTitle from './StyledDialogTitle';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';

interface Props {
    open: boolean,
    onClose: () => void,
    updateLogin: (val: boolean) => void,
}

const UpdateProfile: React.FC<Props> = ({ open, onClose, updateLogin }) => {
    const styles = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        try {
            if (!password && !username && !confirmPassword) {
                throw new Error('Please Input Username/Password');
            }

            if (password.length !== confirmPassword.length) {
                throw new Error('Passwords do not match');
            } else if (password && password.length < 8) {
                throw new Error('MinLength for password is 8');
            } else {
                let payload: { username?: string; password?: string } = {};
                if (username.length > 0) {
                    payload.username = username;
                }
                if (password.length > 0) {
                    payload.password = password;
                }
                const response = await fetch(`${url}/user/updateProfile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (response.status === 200) {
                    if (password) {
                        sessionStorage.clear();
                        updateLogin(false);
                        history.push('/');
                        setToast({ type: 'success', message: 'Password updated, please login again' });
                    } else {
                        setToast({ type: 'success', message: 'Username updated' });      
                    }
                    onClose();
                } else if (response.status === 401) {
                    throw new Error('Authentication Failed');
                } else {
                    throw new Error('Old password is the same as the New one');
                }
            }
        } catch (error) {
            setToast({ type: 'error', message: `${error}` });
        }
    };

    return (
        <>
            <BootstrapDialog
                aria-labelledby="updateProfile"
                open={open}
            >
                <StyledDialogTitle id="update-profile" onClose={onClose}>
                    Update Profile
                </StyledDialogTitle>
                <DialogContent className={styles.container} dividers>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            id="username"
                            label="New username"
                            margin="normal"
                            value={username}
                            onChange={(e): void =>
                                setUsername(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            id="password1"
                            label="New password"
                            type="password"
                            margin="normal"
                            value={password}
                            onChange={(e): void =>
                                setPassword(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            id="password2"
                            label="Confirm new password"
                            type="password"
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e): void => {
                                setConfirmPassword(e.target.value);
                            }}
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

        </>
    );
};
export default UpdateProfile;