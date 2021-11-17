import { styled, makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
export const colorTypography = styled(Typography)({
    color: "#FFF1FF",
});
export const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
        marginTop: 200, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center'
    },
    up: {
        color: 'blue',
    },
    down: {
        color: 'red',
    },
    box: {
        marginTop: 2,
    },
    title: {
        color: '#0017ea',
    }
})); 
