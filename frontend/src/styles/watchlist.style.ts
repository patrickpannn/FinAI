import { createStyles, makeStyles, styled, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) => createStyles({
    selected: {
        backgroundColor: '#d7eafd',
    },
    tab: {
        fontSize: '14pt!important',
    },
    noTickers: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: "1em",
        [theme.breakpoints.down("sm")]: {
        fontSize: "0.75em",
        },
    },
    cardBody: {
        fontSize: "0.75em",
        [theme.breakpoints.down("sm")]: {
        fontSize: "0.5em",
        },
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
        backgroundColor: '#d7eafd',
    },
});

export const Symbol = styled('h2')({
    margin: 0,
});

export const RightContent = styled('div')({
    flex: 5,
    position: 'relative',
});

export const TabContainer = styled('div')({
    width: '100%',
});

export const StyledTabs = styled('div')({
    width: '76.9%',
    height: '60px',
    display: 'flex',
    position: 'fixed',
    bottom: 0,
});


export const StyledTab = styled('div')({
    flex: 1,
    borderTop: '1px solid #edece8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '18pt',
    fontWeight: 600,
    color: '#0017ea',
    fontFamily: 'Arial',
    '&:hover': {
        backgroundColor: '#d7eafd',
    }
});

