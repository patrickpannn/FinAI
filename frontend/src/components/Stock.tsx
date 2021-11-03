import React, { useState } from 'react';
import { Main, Title, Banner, useStyles, BuyBtn, ButtonGroup } from '../styles/stock.style';
import StockChart from './StockChart';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { IconButton } from '@mui/material';

const Stock: React.FC = () => {
    const styles = useStyles();
    const [addToWatchlist, setAddToWatchlist] = useState(false);

    const handleAddTicker = (): void => {
        setAddToWatchlist(!addToWatchlist);

    };

    return (
        <Main>
            <Title>
                <h1>Apple inc</h1>
            </Title>
            <Banner>
                <h1>$148.96</h1>
                <IconButton
                    aria-label="add to watchlist"
                    onClick={handleAddTicker}
                    type='button'
                >
                    {addToWatchlist
                        ? <StarIcon fontSize='large' className={styles.selected} />
                        : <StarOutlineIcon fontSize='large' className={styles.unselected} />
                    }
                </IconButton>
            </Banner>
            <ButtonGroup>
                <BuyBtn
                    variant="contained"
                    type='button'
                >
                    Buy Shares
                </BuyBtn>
            </ButtonGroup>
            <StockChart />
        </Main>
    );
};

export default Stock;
