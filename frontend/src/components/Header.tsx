import React, { useState } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import {
    StyledSearchBar,
    useStyles,
    SearchForm,
    StyledIconBtn,
    LoginButton,
    SignupButton
} from '../styles/header.style';
import { useHistory } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';

interface Props {
    page: string,
    openTopupModal?: () => void,
    openUpdateModal?: () => void,
}

const Header: React.FC<Props> = ({ page, openTopupModal, openUpdateModal }) => {
    const history = useHistory();
    const styles = useStyles();
    const [openSideBar, setOpenSideBar] = useState(false);

    const handleSearch = (
        e: React.FormEvent<HTMLFormElement>
    ): void => {
        e.preventDefault();
    };

    return (
        <AppBar position='static' color='inherit' className={styles.appBar}>
            <Toolbar>
                <Typography sx={{ flexGrow: 1, color: '#0017ea' }}>
                    Smart Portfolio.
                </Typography>
                {page === 'HOME' &&
                    <>
                        <SignupButton
                            variant="contained"
                            type='button'
                            onClick={(): void => history.push('/signup')}
                        >
                            Sign Up
                        </SignupButton>
                        <LoginButton
                            variant="outlined"
                            type='button'
                            onClick={(): void => history.push('/login')}
                        >
                            Login
                        </LoginButton>
                    </>
                }
                {page === 'DASHBOARD' &&
                    <>
                        <SearchForm onSubmit={handleSearch}>
                            <StyledIconBtn
                                size="large"
                                aria-label="search stock"
                            >
                                <SearchIcon />
                            </StyledIconBtn>
                            <StyledSearchBar
                                type='text'
                                placeholder='search...'
                            />
                        </SearchForm>
                        <StyledIconBtn
                            size="large"
                            aria-label="open sidebar"
                            aria-haspopup="true"
                            onClick={(): void => setOpenSideBar(true)}
                        >
                            <MenuIcon />
                        </StyledIconBtn>
                        <Sidebar
                            open={openSideBar}
                            onClose={(): void => setOpenSideBar(false)}
                            openTopupModal={openTopupModal}
                            openUpdateModal={openUpdateModal}
                        />
                    </>
                }
            </Toolbar>
        </AppBar>
    );
};

export default Header;
