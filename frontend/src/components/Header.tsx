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
import Stocks from '../data/sanitisedStocks.json';

interface Props {
    page: string,
    openTopupModal?: () => void,
    openUpdateModal?: () => void,
    handleSearch?(ticker: string, stockName: string): void,
    updateLogin?: (val: boolean) => void,
}

interface Stock {
    description: string,
    symbol: string,
}

const Header: React.FC<Props> = ({
    page,
    openTopupModal,
    openUpdateModal,
    handleSearch,
    updateLogin,
}) => {

    const history = useHistory();
    const styles = useStyles();
    const [openSideBar, setOpenSideBar] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilterData] = useState<Stock[]>([]);

    const handleSearchSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ): void => {
        e.preventDefault();
        if (filteredData.length !== 0 && handleSearch) {
            handleSearch(
                filteredData[0].symbol,
                filteredData[0].description.toLowerCase()
            );
            history.push('/dashboard');
        }
        setFilterData([]);
        setSearchTerm('');
    };

    const updateSearchWord = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const searchWord = e.target.value;
        setSearchTerm(searchWord);
        if (!searchWord) {
            setFilterData([]);
        } else {
            const newData = Stocks.filter((stock) => {
                return (
                    stock.symbol.toUpperCase().includes(
                        searchWord.toUpperCase()
                    ) ||
                    stock.description.toUpperCase().includes(
                        searchWord.toUpperCase()
                    )
                );
            });
            setFilterData(newData);
        }
    };

    const handleSearchItem = (symbol: string, stockName: string): void => {
        if (handleSearch) {
            handleSearch(symbol, stockName.toLowerCase());
            history.push('/dashboard');
            setFilterData([]);
            setSearchTerm('');
        }
    };

    return (
        <AppBar position={page === 'HOME' ? 'static' : 'sticky'} color='inherit' className={styles.appBar}>
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
                        <SearchForm onSubmit={handleSearchSubmit}>
                            <StyledSearchBar
                                type='text'
                                placeholder='search...'
                                value={searchTerm}
                                onChange={updateSearchWord}
                            />
                            <StyledIconBtn
                                size="large"
                                aria-label="search stock"
                                type='submit'
                            >
                                <SearchIcon />
                            </StyledIconBtn>
                            {filteredData.length !== 0 &&
                                (<div className={styles.searchDropdown}>
                                    <div className={styles.searchTitle}>
                                        <h3>Symbols</h3>
                                    </div>
                                    {filteredData.slice(0, 15).map((
                                        val, idx
                                    ) => (
                                        <div
                                            key={idx}
                                            className={styles.searchItem}
                                            onClick={(): void =>
                                                handleSearchItem(
                                                    val.symbol,
                                                    val.description
                                                )
                                            }
                                        >
                                            <p>{val.symbol}</p>
                                            <p className={styles.stockName}>
                                                {val.description.toLowerCase()}
                                            </p>
                                        </div>)
                                    )}
                                </div>)
                            }
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
                            updateLogin={updateLogin}
                        />
                    </>
                }
            </Toolbar>
        </AppBar>
    );
};

export default Header;
