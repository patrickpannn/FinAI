import React from 'react';
import { useStyles } from '../styles/dialog.style';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const StyledDialogTitle: React.FC<DialogTitleProps> = ({
    children, onClose
}) => {
    const styles = useStyles();

    return (
        <DialogTitle className={styles.dialogtitle}>
            {children}
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
                className={styles.closeBtn}
            >
                <CloseIcon />
            </IconButton>
        </DialogTitle>
    );
};

export default StyledDialogTitle;