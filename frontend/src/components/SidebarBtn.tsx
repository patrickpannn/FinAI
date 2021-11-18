import React from 'react';
import {
    ListItem,
    ListItemIcon,
    ListItemButton,
} from '@mui/material';
import { useStyles } from '../styles/sideBar.style';

interface Props {
    text: string,
    childNode: React.ReactNode,
    onClick?: () => void,
}
// The buttons in the sidebar
const SidebarBtn: React.FC<Props> = ({ text, childNode, onClick }) => {
    const styles = useStyles();

    return (
        <ListItem>
            <ListItemButton onClick={onClick}>
                <ListItemIcon>
                    {childNode}
                </ListItemIcon>
                <p className={styles.btnColor}>{text}</p>
            </ListItemButton>
        </ListItem>

    );
};

export default SidebarBtn;
