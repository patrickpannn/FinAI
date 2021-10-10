import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useStyles } from '../styles/homepage.style';
import { useHistory } from 'react-router-dom';

interface Props {
    home: boolean
}

const Header: React.FC<Props> = ({ home }) => {
    const history = useHistory();
    const styles = useStyles();
    
    return (
        <AppBar position='static' color='inherit' className={styles.appBar}>
            <Toolbar>
                <Typography sx={{ flexGrow: 1, color: '#0017ea' }}>
                    Smart Portfolio.
                </Typography>
                {home && <Button
                    variant="contained"
                    type='button'
                    sx={{ backgroundColor: '#0017ea' }}
                    onClick={(): void => history.push('/signup')}
                >
                    Sign Up
                </Button>}
                {home && <Button
                    variant="outlined"
                    type='button'
                    sx={{ color: '#0017ea', borderColor: '#0017ea' }}
                    onClick={(): void => history.push('/login')}
                >
                    Login
                </Button>}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
