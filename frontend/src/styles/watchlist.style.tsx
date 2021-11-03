import { createStyles, makeStyles, styled, Theme } from "@material-ui/core/styles";


export const useStyles = makeStyles((theme: Theme) => createStyles({
    selected: {
        backgroundColor: 'lightgrey',
    },
    tab: {
        fontSize: '14pt!important',
    }
}));

export const Main = styled('div')({
    width: '100%',
    height: 'calc(100vh - 80px)',
    display: 'flex',
});

export const LeftBar = styled('div')({
    flex: 1.5,
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
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    cursor: 'pointer',
    '& p': {
        margin: 0,
        fontSize: '14pt',
    },
    '&:hover': {
        backgroundColor: 'lightgrey',
    },
});

export const Symbol = styled('h2')({
    margin: 0,
});

export const RightContent = styled('div')({
    flex: 5,
});

export const TabContainer = styled('div')({
    width: '100%',
});

