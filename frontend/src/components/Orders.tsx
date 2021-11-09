import React, { useState } from 'react';
// import { useStyles } from '../styles/order.style';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Typography, Table, TableContainer , TableHead, TableRow, TableBody } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
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
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));
    return (
        <>
        <div style={{ padding: '50px' }}>
        <Typography variant="h4">Order History</Typography>
        <TableContainer component={Paper} >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <StyledTableCell>Symbol</StyledTableCell>
                    <StyledTableCell>Stock Name</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Stock Price Each</StyledTableCell>
                    <StyledTableCell>Total Price</StyledTableCell>
                    <StyledTableCell>Direction</StyledTableCell>
                    <StyledTableCell>Portfolio</StyledTableCell>
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