import React, { useState, useEffect } from 'react';
import { useStyles } from '../styles/orders.style';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { useDispatch } from 'react-redux';
import { Table, TableContainer, TableHead, TableRow, TableBody, Button } from '@mui/material';
import { Row, C, OrderTitle } from '../styles/orders.style';
import Paper from '@mui/material/Paper';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';

interface OrderInterface {
    id: string,
    numUnits: number,
    executePrice: number,
    ticker: string,
    name: string,
    executed: boolean,
    direction: string,
    portfolio: string,
}
const Orders: React.FC = () => {

    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const [orders, setOrders] = useState<OrderInterface[]>([]);
    const [id, setId] = useState('');
    const [changed, setChanged] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        try {
            const response = await fetch(`${url}/user/order/cancelOrder`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
                },
                body: JSON.stringify({
                    id
                })
            });

            if (response.status === 200) {
                setToast({ type: 'success', message: 'Order cancelled' });
                setChanged(!changed);
            }
        } catch (error) {
            setToast({ type: 'error', message: `${error}` });
        }

    };

    useEffect(() => {
        const fetchOrders = async (): Promise<void> => {
            try {
                const response = await fetch(`${url}/user/order`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
                    },
                });
                if (response.status === 200) {
                    const data = await response.json();
                    console.log(data);
                    setOrders(data);
                } else {
                    throw new Error('Failed to fetch order history');
                }
            } catch (e) {
                setToast({ type: 'error', message: `${e}` });
            }
        };
        fetchOrders();
        // eslint-disable-next-line
    }, [changed]);

    return (
        <div className={styles.tableSpace}>
            <OrderTitle>
                <h2>My Orders</h2>
            </OrderTitle>
            <form onSubmit={(e): Promise<void> => handleSubmit(e)}>
                <TableContainer component={Paper}>
                    <Table className={styles.tableSize} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <C>Symbol</C>
                                <C>Stock Name</C>
                                <C>Quantity</C>
                                <C>Stock Price Each</C>
                                <C>Total Price</C>
                                <C>Direction</C>
                                <C>Portfolio</C>
                                <C>Status</C>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {orders && orders.map(o => (
                                <Row key={o.id}>
                                    <C>{o.ticker}</C>
                                    <C>{o.name}</C>
                                    <C>{o.numUnits}</C>
                                    <C>{(o.executePrice).toFixed(2)}</C>
                                    <C>
                                        {(o.numUnits
                                            * o.executePrice).toFixed(2)
                                        }
                                    </C>
                                    <C>{o.direction}</C>
                                    <C>{o.portfolio}</C>
                                    {o.executed &&
                                        <C
                                            className={styles.executedColor}
                                        >
                                            Executed
                                        </C>
                                    }
                                    {!o.executed &&
                                        <C>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="error"
                                                onClick={
                                                    (): void => setId(o.id)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </C>
                                    }
                                </Row>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </form>
        </div>
    );
};
export default Orders;