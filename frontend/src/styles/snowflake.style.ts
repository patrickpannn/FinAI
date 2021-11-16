import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) => createStyles({
    chartContainer: {
        position: "relative",
        height:'300px',
        width:'300px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',

    },
    label: {
        textAlign: 'center',
    }
}));