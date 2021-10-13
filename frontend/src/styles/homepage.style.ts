import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import backImg from '../assets/homeBackGround.png';
import { Card } from "@mui/material";

export const useStyles = makeStyles((theme: Theme) => createStyles({
    avatar: {
        background: 'linear-gradient(-45deg, #5273c4, #072bee)',
        position: 'absolute',
        top: -180,
    },
    card: {
        width: '100%',
        height: '100vh',
        display: 'flex',
    },
    box: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        border: '1px solid black',
        '& > svg': {
            fontSize: '35pt',
        }
    },
    title: {
        position: 'absolute',
        top: 260
    },
    notes: {
        fontSize: 6,
    },
    appBar: {
        fontFamily: 'Arial',
        '& p': {
            fontSize: '25pt',
            fontWeight: '600',
        },
        '& button': {
            margin: '5px',
            borderRadius: '10px',
            fontSize: '1.1rem',
        }
    },
    backBtn: {
        position: 'absolute',
        top: '5%',
        left: '5%',
        cursor: 'pointer',
    }

}));

export const Container = styled('main')({
    width: '100%',
    height: '100vh',
    margin: 0,
    padding: 0,
    // background: 'linear-gradient(-45deg, #7085cc, #072bee)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export const Form = styled('form')({
    marginTop: '20px',
    width: '400px',
    height: '320px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    '& button': {
        backgroundColor: '#072bee',
    }
});

export const Main = styled('main')({
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    backgroundImage: `url(${backImg})`,
    backgroundSize: '100% 100%',
    position: 'fixed',
    fontFamily: 'Arial',
});

export const StyledCard = styled(Card)({
    position: 'absolute',
    left: '15%',
    top: '20%',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    width: '600px',
    height: '700px',
    '& > h1': {
        color: '#0117ea',
        fontSize: '60pt',
        letterSpacing: '2px',
        fontWeight: '700',
    },
    '& > h2': {
        fontSize: '25pt',
    }
});

