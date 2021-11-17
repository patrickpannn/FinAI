import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import { Button, Avatar } from '@mui/material';

export const DialogContent = styled('p')(({ theme }) => ({
    color: 'red',
    margin: 0,
}));

export const LargeButton = styled(Button)({
    width: '240px',
    backgroundColor: '#0017ea'
});
export const useStyles = makeStyles((theme: Theme) => createStyles({
    sideBar: {
        background: '#f5f5f5',
        width: '300px',
        height: '100vh'
    },
    username: {
        fontWeight: 700,
        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        fontSize: '14pt',
        margin: '0 8px',
        '&:first-letter': {
            textTransform: 'capitalize',
        }
    },
    topup: {
        justifyContent: 'center',
        margin: '40px auto',
    },
    menuLabel: {
        color: 'grey',
        fontSize: '14px',
        fontWeight: 700,
        padding: '0 20px',
        margin: '10px 0'
    },
    btnColor: {
        color: '#0017ea',
        fontWeight: 600,
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '30px 0',
    },
}));

export const StyledAvatar = styled(Avatar)({
    width: 40, 
    height: 40, 
    backgroundColor: 'blue',
});