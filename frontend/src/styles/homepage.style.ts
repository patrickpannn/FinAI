import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';


export const useStyles = makeStyles((theme: Theme) => createStyles({
    avatar: {
        background: 'linear-gradient(-45deg, #23A6D5,#4161c2c5, #21aa8a)',
        position: 'absolute',
        top: -120,
    },
    btn: {
        background: 'linear-gradient(-45deg, #23A6D5,#4161c2c5, #21aa8a)',
    },
    card: {
        width: '1500px',
        height: '800px',
        display: 'flex',
    },
    box: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    title: {
        position: 'absolute',
        top: 160
    },
    notes: {
        fontSize: 6,
    }

}));

export const Container = styled('div')({
    width: '100%',
    height: '100vh',
    margin: 0,
    padding: 0,
    background: 'linear-gradient(-45deg, #23A6D5,#4161c2c5, #21aa8a)',
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
});
