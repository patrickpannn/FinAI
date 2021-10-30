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
        height: '300px',
    },
    form: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    }
}
));