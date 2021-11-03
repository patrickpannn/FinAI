import { createStyles, makeStyles, styled, Theme } from "@material-ui/core/styles";
// import { styled } from '@mui/material/styles';

export const useStyles = makeStyles((theme: Theme) => createStyles({
   
}));

export const Main = styled('div')({
    width: '100%',
    height: 'calc(100vh - 80px)',
    display: 'flex',
});

export const LeftBar = styled('div')({
    flex: 1,
    overflow: 'auto',
    borderRight: '1px solid #edece8',
    '&::-webkit-scrollbar': {
        display: 'none',
    },
});

export const WatchlistTitle = styled('div')({
    textAlign: 'center',
    borderBottom: '1px solid #edece8',
});

export const TickerItem = styled('div')({
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    cursor: 'pointer',
    '& p': {
        margin: 0,
    },
    '&:hover': {
        backgroundColor: 'lightgrey',
    },
});

export const Symbol = styled('h3')({
    margin: 0,
});

export const RightContent = styled('div')({
    flex: 5,
});
