import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) => createStyles({
	profit: {
		color: 'green!important'
	},
	loss: {
		color: 'red!important'
	},
	content: {
		background: '#eee',
		border: '1px solid #eee',
		padding: '20px'
	},
	label: {
		color: '#0017ea!important'
	},
	create_btn: {
		backgroundColor: '#0017ea!important'
	},
	delete_btn: {
		color: '#0017ea!important',
		border: '1px solid #0017ea!important'
	}
}));