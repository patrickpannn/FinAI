import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) => createStyles({
    profit: {
        color: 'red!important'
    },
    loss: {
        color: 'green!important'
    },
    content: {
	background: '#eee',
	border: '1px solid #eee',
	padding: '20px'
    },
}));