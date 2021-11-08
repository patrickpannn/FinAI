import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) => createStyles({
    chartContainer: {
        position: "relative",
        height:'40vh',
        width:'80vw',
    }
}));