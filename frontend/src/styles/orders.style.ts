import { createStyles, makeStyles, styled, Theme } from "@material-ui/core/styles";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { TableRow } from '@mui/material';
export const useStyles = makeStyles((theme: Theme) => createStyles({
    tableSpace: {
        padding: '50px',
    },
    tableSize: {
        minWidth: 650,
    },
    executedColor: {
        color: 'green!important',
    }
}));

export const C = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

export const Row = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export const OrderTitle = styled('div')({
    textAlign: 'center',
    borderBottom: '1px solid #edece8',
    position: 'sticky',
    backgroundColor: 'white',
    color: 'blue',
    top: 0,
});
