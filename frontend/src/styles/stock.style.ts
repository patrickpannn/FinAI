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
    }
}));

export const Main = styled('div')({
    width: '100%',
    height: '100%',
});

export const Title = styled('div')({
    textAlign: 'center',
});

export const PriceChart = styled('div')({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
});

export const Banner = styled('div')({
    width: '100%',
    height: '60px',
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& h1': {
        marginLeft: '10%',
    },
    '& button': {
        marginRight: '310px',
    }
});

export const BuyBtn = styled(Button)({
    backgroundColor: '#0017ea',
    width: '150px',
    marginRight: '260px',
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