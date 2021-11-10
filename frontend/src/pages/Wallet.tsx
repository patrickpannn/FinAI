import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { Container, Box } from '@mui/material';
import { useStyles } from '../styles/wallet.style';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';
interface Props {
}
type Color = 'up' | 'down';

const Wallet: React.FC<Props> = () => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const [balance, setBalance] = useState(0);
    const [availableBalance, setAvailableBalance] = useState(0);
    
    const [balanceColor, setBalanceColor] = useState<Color>('up');
    const [availableBalanceColor, setAvailableBalanceColor] = useState<Color>('up');

    const fetchBalance = async (): Promise<void> => {
        try {
            const response = await fetch(`${url}/user/balance`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                if (data.balance > 0) {
                    setBalanceColor('up');
                } else {
                    setBalanceColor('down');
                };
                if (data.availableBalance > 0) {
                    setAvailableBalanceColor('up');
                } else {
                    setAvailableBalanceColor('down');
                };
                setBalance(data.balance);
                setAvailableBalance(data.availableBalance);
            } else {
                throw new Error('Failed to fetch user balance');
            }
        } catch (e) {
            setToast({ type: 'error', message: `${e}` });

        }
    };
    fetchBalance();
    return (
        <Container>
                <Box className={styles.container}>
                    <h1 className={styles.title}>
                        Your Balance
                    </h1>
                    <Box className={styles.box}>
                        <h2>
                            <span>
                                Your Total Balance is{' '}
                            </span>
                            <span className={styles[balanceColor]}>
                                ${balance}
                            </span>
                        </h2>
                        <h2>
                            <span>
                                Your Available Balance is{' '}
                            </span>
                            <span className={styles[availableBalanceColor]}>
                                ${availableBalance}
                            </span>
                        </h2>
                    </Box>
                </Box>
        </Container>
    );
};
export default Wallet; 