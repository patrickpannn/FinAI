import React from 'react';
import { Card, TextField, Grid, Typography, Box, Button, Avatar } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useStyles, Form, Container } from '../styles/homepage.style';
import { Link } from 'react-router-dom';

interface Props { }

const Login: React.FC<Props> = () => {
    const styles = useStyles();
    return (
        <Container>
            <Card sx={{ borderRadius: 5 }} className={styles.card}>
                <Box sx={{ flex: 1, bgcolor: 'blue' }}>
                    <h1>Smart Portfolio</h1>
                    <h3>
                        Trade US stock and Crypto with confidence
                    </h3>
                </Box>
                <Box className={styles.box}>
                    <Avatar className={styles.avatar}><LockIcon /></Avatar>
                    <Typography variant="h3" className={styles.title}>Sign in</Typography>
                    <Form>
                        <TextField
                            margin="normal"
                            id="email"
                            label="Email"
                            type='email'
                            required
                            fullWidth
                        />
                        <TextField
                            margin="normal"
                            id="password"
                            label="Password"
                            type="password"
                            required
                            fullWidth
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            className={styles.btn}
                            fullWidth
                        >
                            Sign In
                        </Button>
                        <Grid container sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item>
                                <Typography className={styles.notes}>
                                    <Link to="/resetpassword">Forgot password ?</Link>
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
