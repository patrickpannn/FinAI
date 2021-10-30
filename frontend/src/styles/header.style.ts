import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { styled } from '@mui/material/styles';
import { IconButton, Button } from '@mui/material';

export const useStyles = makeStyles((theme: Theme) => createStyles({
    appBar: {
        fontFamily: 'Arial',
        '& p': {
            fontSize: '25pt',
            fontWeight: '600',
        },
        '& button': {
            margin: '5px',
            borderRadius: '10px',
            fontSize: '1.1rem',
        }
    },
}));

export const StyledIconBtn = styled(IconButton)({
    color: '#0017ea',
});

export const StyledSearchBar = styled('input')({
    height: '30px',
    width: '200px',
    borderRadius: '5px',
    border: '0',
    backgroundColor: '#f3f6f9',
    padding: '5px',
    '&::-webkit-input-placeholder': {
        fontSize: '12pt',
        padding: '5px',
    }
});

export const SearchForm = styled('form')({
    display: "flex",
    alignItems: 'center',
    marginRight: '10px',
});

export const SignupButton = styled(Button)({
	backgroundColor: '#0017ea'
});

export const LoginButton = styled(Button)({
	color: '#0017ea',
	borderColor: '#0017ea'	
});