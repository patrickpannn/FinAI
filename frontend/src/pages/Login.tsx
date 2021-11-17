import React, { useState } from 'react';
import { Card, TextField, Grid, Typography, Box, Button, Avatar } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useStyles, Form, Container, InnerContainer } from '../styles/homepage.style';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import CardMedia from '@mui/material/CardMedia';
import loginPage from '../assets/loginPage.png';


interface Props {
    updateLogin: (val: boolean) => void,
}

const url = process.env.REACT_APP_URL || 'http://localhost:5000';

const Login: React.FC<Props> = ({ updateLogin }) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        try {
            const response = await fetch(`${url}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (response.status === 400) {
                throw new Error('Email and Password do not match');
            } else {
                const { token } = await response.json();
                sessionStorage.setItem('access_token', token);
                updateLogin(true);
                history.push('/dashboard');
            }

        } catch (error) {
            setToast({ type: 'error', message: `${error}` });
        }

    };
    return (
        <Container>
            <Card className={styles.card}>
                <CardMedia
                    component="img"
                    image={loginPage}
                    alt="login page"
                    sx={{ flex: 1 }}
                />
                <Box className={styles.box}>
                    <ChevronLeftIcon
                        aria-label="go back button"
                        className={styles.backBtn}
                        onClick={(): void => history.push('/')}
                    />
                    <Avatar className={styles.avatar}><LockIcon /></Avatar>
                    <InnerContainer page='login'>
                        <Typography variant="h3" gutterBottom component="div">
                            Welcome Back
                        </Typography>
                        <Typography variant="subtitle1" className={styles.subtitle} gutterBottom component="div">
                            Log into your account
                        </Typography>
                    </InnerContainer>
                    <Form onSubmit={(e): Promise<void> => handleSubmit(e)}>
                        <TextField
                            margin="normal"
                            id="email"
                            label="Email"
                            type='email'
                            value={email}
                            onChange={(e): void => setEmail(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            margin="normal"
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e): void => setPassword(e.target.value)}
                            required
                            fullWidth
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                        >
                            Sign In
                        </Button>
                        <Grid container sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item>
                                <Typography className={styles.notes}>
                                    <Link to="/forgotpassword">Forgot password ?</Link>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography className={styles.notes}>
                                    Do you have an account?{' '}
                                    <Link to="/signup">Sign Up</Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Form>
                </Box>
            </Card>
        </Container>
    );
};

export default Login;
