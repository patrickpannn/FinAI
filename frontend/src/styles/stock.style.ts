import { Button } from '@mui/material';
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => createStyles({
    selected: {
        color: 'orange',
    },
    unselected: {
        color: 'grey',
    },
    buyBtn: {
        backgroundColor: '#0017ea',
    },
    sellBtn: {
        color: '#0017ea',
        borderColor: '#0017ea',
    },
    normal: {
        color: 'black',
    },
    up: {
        color: 'green',
    },
    down: {
        color: 'red',
    }
}));

export const Main = styled('div')({
    width: '70%',
    margin: '0 auto',
    height: 'calc(100% - 60px)',
});

export const Title = styled('div')({
    textAlign: 'center',
    '& h1:first-letter': {
        textTransform: 'capitalize',
    },
    '& h1': {
        margin: '0',
        padding: '20px 0',
    }
});

export const PriceChart = styled('div')({
    width: '100%',
    height: '500px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export const Banner = styled('div')({
    width: '100%',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

export const BuyBtn = styled(Button)({
    backgroundColor: '#0017ea',
    width: '150px',
});

export const SellBtn = styled(Button)({
    color: '#0017ea',
    borderColor: '#0017ea',
    width: '100px',
});

export const ButtonGroup = styled('div')({
    width: '100%',
    height: '50px',
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '30px',
});

export const StockInfoBox = styled('div')({
    width: '100%',
    height: '100px',
    margin: '20px 0',
    borderRadius: '5px',
    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 5px 10px',
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
    '& div': {
        textAlign: 'center',
        margin: 'auto 0',
    } 
});