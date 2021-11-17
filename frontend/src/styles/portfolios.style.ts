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
	label: {
		color: '#0017ea'
	},
	create_btn: {
		backgroundColor: '#0017ea!important'
	}
}));