import React, { useState } from 'react';
import { Card, TextField, Typography, Box, Button, Avatar } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useStyles, Form, Container, InnerContainer } from '../styles/homepage.style';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import CardMedia from '@mui/material/CardMedia';
import signUpPage from '../assets/signupPage.png';


interface Props { }

const url = process.env.REACT_APP_URL || 'http://localhost:5000';

const ForgotPassword: React.FC<Props> = () => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [disableSendBtn, setDisableSendBtn] = useState(false);
    const [verified, setVerified] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');

    const sendCode = async (): Promise<void> => {
        try {
            const response = await fetch(`${url}/user/sendCode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });
            if (response.status === 200) {
                setSent(true);
                setToast({ type: 'success', message: 'Email sent!' });
            } else {
                setDisableSendBtn(false);
                throw new Error('Account Not Exists!');
            }
        } catch (e) {
            setToast({ type: 'error', message: `${e}` });
        }
    };

    const verifyCode = async (): Promise<void> => {
        try {
            const response = await fetch(`${url}/user/verifyCode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    code
                })
            });

            if (response.status === 200) {
                const { resetToken } = await response.json();
                sessionStorage.setItem('reset_token', resetToken);
                setVerified(true);
                setSent(false);
            } else {
                throw new Error('Invalid code');
            }

        } catch (e) {
            setToast({ type: 'error', message: `${e}` });
        }
    };

    const updatePassword = async (): Promise<void> => {
        try {
            if (password.length !== confirmPassword.length) {
                throw new Error('Passwords not match');
            }
            if (password.length < 8) {
                throw new Error('Password at least 8 characters');
            }
            if (!sessionStorage.getItem('reset_token')) {
                throw new Error('Bad Request');
            }
            const response = await fetch(`${url}/user/resetPassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('reset_token')}`
                },
                body: JSON.stringify({
                    password
                })
            });

            if (response.status === 200) {
                sessionStorage.removeItem('reset_token');
                setToast({ type: 'success', message: 'Password Updated' });
                history.push('/login');
            } else {
                throw new Error('Invalid Password');
            }
        } catch (e) {
            setToast({ type: 'error', message: `${e}` });
        }

    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        try {
            if (!sent && !verified) {
                setDisableSendBtn(true);
                sendCode();
            } else if (sent) {
                verifyCode();
            } else {
                updatePassword();
            }
        } catch (error) {
            setToast({ type: 'error', message: `${error}` });
        }

    };
    return (
        <Container>
            <Card className={styles.card}>
                <Box className={styles.box}>
                    <ChevronLeftIcon
                        aria-label="go back button"
                        className={styles.backBtn}
                        onClick={(): void => history.push('/')}
                    />
                    <Avatar className={styles.avatar}><LockIcon /></Avatar>
                    <InnerContainer page='forgotpassword'>
                        {!verified &&
                            <Typography variant="h3" gutterBottom component="div">
                                Reset your Password
                            </Typography>
                        }
                        {!verified && <Typography
                            variant="subtitle1"
                            className={styles.subtitle}
                            gutterBottom
                            component="div"
                        >
                            The verification email will
                            be sent to the mailbox.
                            Please check it.
                        </Typography>}
                        {verified &&
                            <Typography
                                variant="h3"
                                gutterBottom
                                component="div"
                            >
                                Create new Password
                            </Typography>
                        }
                        {verified &&
                            <Typography variant="subtitle1" className={styles.subtitle} gutterBottom component="div">
                                Enter new password and then repeat it
                            </Typography>
                        }
                    </InnerContainer>
                    <Form onSubmit={handleSubmit}>
                        {!verified &&
                            <TextField
                                margin="normal"
                                id="email"
                                label="Email"
                                type='email'
                                value={email}
                                onChange={(e): void => setEmail(e.target.value)}
                                disabled={sent}
                                required
                                fullWidth
                            />
                        }
                        {sent &&
                            <TextField
                                margin="normal"
                                id="verificationCode"
                                label="Verification Code"
                                type="text"
                                value={code}
                                onChange={(e): void => setCode(e.target.value)}
                                required
                                fullWidth
                            />
                        }
                        {verified && <TextField
                            margin="normal"
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e): void => setPassword(e.target.value)}
                            required
                            fullWidth
                        />}
                        {verified && <TextField
                            margin="normal"
                            id="confirmPassword"
                            label="ConfirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={
                                (e): void => setConfirmPassword(e.target.value)
                            }
                            required
                            fullWidth
                        />}
                        {!(sent || verified) && <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={disableSendBtn}
                        >
                            Send Code
                        </Button>}
                        {sent && <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                        >
                            Verify Code
                        </Button>}
                        {verified &&
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                            >
                                Update Password
                            </Button>
                        }
                        <Typography className={styles.notes}>
                            Back to{' '}
                            <Link to="/login">Login</Link>
                        </Typography>

                    </Form>
                </Box>
                <CardMedia
                    component="img"
                    image={signUpPage}
                    alt="signup page"
                    sx={{ flex: 1 }}
                />
            </Card>
        </Container>
    );
};

export default ForgotPassword;
