import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import { Dialog, Button } from '@mui/material';

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export const SubmitButton = styled(Button)({
    background: '#0017ea',
});

export const useStyles = makeStyles((theme: Theme) => createStyles({
    selected: {
        backgroundColor: '#d7eafd',
    },
    dialogtitle: {
        m: 0,
        p: 2,
        color: '#0017ea',
    },
    closeBtn: {
        color: theme.palette.grey[500]
    },
    container: {
        width: '450px',
        height: '350px',
        position: 'relative',
        overflow: 'hidden'
    },
    form: {
        width: '100%',
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    }
}
));

export const StyledTab = styled('div')({
    display: 'flex',
    height: '40px',
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

export const TabContainer = styled('div')({
    width: '100%',
    height: '60px',
});
export const StyledTabs = styled('div')({
    width: '100%',
    height: '60px',
    display: 'flex',
    position: 'absolute',
    backgroundColor: 'white',
    bottom: 0,
});
