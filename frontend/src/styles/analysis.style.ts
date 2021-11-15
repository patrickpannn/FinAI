import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import styled from 'styled-components';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface StepProps {
    color: string,
}

interface ArrowProps {
    score: number,
    bgcolor: string,
}

export const useStyles = makeStyles((theme: Theme) => createStyles({
    drop: {
        color: "#d12000",
        position: "absolute",
        left: '-2%',
    },
    label: {
        gridArea: 'label'
    }
}));

export const Main = styled('div')({
    width: '70%',
    margin: '0 auto',
    height: 'calc(100% - 60px)',
    display: 'flex',
    justifyContent: 'center',
});

export const Indicator = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '600px',
    height: '120px',
    backgroundColor: 'yellow',
    position: 'relative',
});

export const Step = styled('div')<StepProps>((
    props: StepProps
) => ({
    backgroundColor: props.color,
    // width: '100px',
    flex: '1',
    height: '20px',
}));


export const StepGroup = styled('div')({
    display: 'flex',
    width: '100%',
    marginTop: '30px',
});

export const Labels = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    '& > p': {
        marginTop: '2px',
    }
});

export const StyledDrop = styled(ArrowDropDownIcon)<ArrowProps>((
    props: ArrowProps
) => ({
    color: props.bgcolor,
    position: "absolute",
    left: `${props.score - 3}%`,
    fontSize: '25pt',
}));