import React, { useCallback, useState, useEffect } from 'react';
import { useStyles } from '../styles/orders.style';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { useDispatch } from 'react-redux';
import { Table, TableContainer , TableHead, TableRow, TableBody } from '@mui/material';
import { Row, Cell, OrderTitle } from '../styles/orders.style';
import Paper from '@mui/material/Paper';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';

interface OrderInterface {
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
    const fetchOrders = useCallback(async (): Promise<void> => {
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
                setOrders(data);
            } else {
                throw new Error('Failed to fetch order history');
            }
        } catch (e) {
            setToast({ type: 'error', message: `${e}` });

        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className={styles.tableSpace}>
            <OrderTitle>
                <h2>My Orders</h2>
            </OrderTitle>
            <TableContainer component={Paper} >
                <Table className={styles.tableSize} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <Cell>Symbol</Cell>
                            <Cell>Stock Name</Cell>
                            <Cell>Quantity</Cell>
                            <Cell>Stock Price Each</Cell>
                            <Cell>Total Price</Cell>
                            <Cell>Direction</Cell>
                            <Cell>Portfolio</Cell>
                            <Cell>Status</Cell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders && orders.map(order => (
                            <Row key= {order.ticker}>
                                <Cell>{order.ticker}</Cell>
                                <Cell>{order.name}</Cell>
                                <Cell>{order.numUnits}</Cell>
                                <Cell>{order.executePrice}</Cell>
                                <Cell>
                                    {order.numUnits * order.executePrice}
                                </Cell>
                                <Cell>{order.direction}</Cell>
                                <Cell>{order.portfolio}</Cell>
                                {order.executed && 
                                    <Cell>Executed</Cell>
                                }
                            </Row>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};
export default Orders;  