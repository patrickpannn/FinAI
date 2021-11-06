import React, { useState } from 'react';
import { useStyles } from '../styles/orders.style';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { useDispatch } from 'react-redux';
import { Typography, Table, TableContainer , TableHead, TableRow, TableBody } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../styles/orders.style';
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
                setOrders(data);
            } else {
                throw new Error('Failed to fetch order history');
            }
        } catch (e) {
            setToast({ type: 'error', message: `${e}` });

        }
    };
    fetchOrders();

    return (
        <>
            <div className={styles.tableSpace}>
                <Typography variant="h4">Order History</Typography>
                <TableContainer component={Paper} >
                    <Table className={styles.tableSize} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Symbol
                                </StyledTableCell>
                                <StyledTableCell>
                                    Stock Name
                                </StyledTableCell>
                                <StyledTableCell>
                                    Quantity
                                </StyledTableCell>
                                <StyledTableCell>
                                    Stock Price Each
                                </StyledTableCell>
                                <StyledTableCell>
                                    Total Price
                                </StyledTableCell>
                                <StyledTableCell>
                                    Direction
                                </StyledTableCell>
                                <StyledTableCell>
                                    Portfolio
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders && orders.map(order => (
                                <StyledTableRow key= {order.ticker}>
                                    <StyledTableCell>
                                        {order.ticker}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {order.name}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {order.numUnits}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {order.executePrice}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {order.numUnits * order.executePrice}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {order.direction}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {order.portfolio}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};
export default Orders;  