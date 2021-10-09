import React, { useState } from 'react';
import { Card, TextField, Typography, Box, Button, Avatar } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useStyles, Form, Container } from '../styles/homepage.style';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { useHistory, Link } from 'react-router-dom';

interface Props { }

const Signup: React.FC<Props> = () => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        console.log(`${process.env.REACT_APP_URL}/user/signup`);
        try {
            if (password.length < 8) {
                setToast({ type: 'error', message: 'MinLength for password is 8' });
            } else if (password !== confirmPassword) {
                setToast({ type: 'error', message: 'Passwords do not match' });
            } else {

                const response = await fetch(`${process.env.REACT_APP_URL}/user/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                });
                if (response.status === 400) {
                    throw new Error('Email Already Taken');
                } else {
                    const { token } = await response.json();
                    console.log(token);
                    sessionStorage.setItem('access_token', token);
                    history.push('/dashboard');
                }
            }
        } catch (error) {
            setToast({ type: 'error', message: `${error}` });
        }
    };

    return (
        <Container>
            <Card sx={{ borderRadius: 5 }} className={styles.card}>
                <Box className={styles.box}>
                    <Avatar className={styles.avatar}><LockIcon /></Avatar>
                    <Typography variant="h3" className={styles.title}>Create Account</Typography>
                    <Form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            id="email"
                            type='email'
                            label="Email"
                            value={email}
                            onChange={(e): void => setEmail(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            margin="normal"
                            id="username"
                            type='text'
                            label="Username"
                            value={username}
                            onChange={(e): void => setUsername(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            margin="normal"
                            id="password"
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e): void => setPassword(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            margin="normal"
                            id="confirmPassword"
                            type="password"
                            label="ConfirmPassword"
                            value={confirmPassword}
                            onChange={(e): void => {
                                setConfirmPassword(e.target.value);
                            }}
                            required
                            fullWidth
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ marginTop: 1 }}
                            className={styles.btn}
                            fullWidth
                        >
                            Create
                        </Button>

                        <Typography
                            sx={{ marginTop: 2 }}
                            className={styles.notes}
                        >
                            Already have an account?{' '}
                            <Link to="/">Log In</Link>
                        </Typography>

                    </Form>
                </Box>
                <Box sx={{ flex: 1, bgcolor: 'blue' }}>
                    <h1>Smart Portfolio</h1>
                    <h3>
                        Trade US stock and Crypto with confidence
                    </h3>
                </Box>
            </Card>
        </Container>
    );
};

export default Signup;
