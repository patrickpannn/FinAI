import React, { useState } from 'react';
// import { useStyles } from '../styles/order.style';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { useDispatch } from 'react-redux';
import { Typography, Table, TableContainer , TableCell, TableHead, TableRow, TableBody } from '@mui/material';

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
const Order: React.FC = () => {

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
    console.log("hi");
    console.log(orders);
    return (
        <>
        <Typography variant="h1">Order History</Typography>
        <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Stock Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total Price</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {orders && orders.map(order => (
                    <TableRow key= {order.ticker}>
                        <TableCell>
                            {order.ticker}
                        </TableCell>
                        <TableCell>
                            {order.name}
                        </TableCell>
                        <TableCell>
                            {order.numUnits}
                        </TableCell>
                        <TableCell>
                            {order.numUnits * order.executePrice}
                        </TableCell>
                    </TableRow>
                ))};
                
                </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
export default Order;