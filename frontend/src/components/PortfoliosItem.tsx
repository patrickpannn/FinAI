import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
} from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useDrag } from 'react-dnd';
import { useStyles } from '../styles/portfolios.style';

interface ItemProps {
	name: string,
	data: Stock,
	onEnd: (name: string, data: { name: string, data: Stock }) => void
	handleSell: (data: SellObject, callback: () => void) => Promise<void>
}

type Stock = {
	name: string,
	averagePrice: number,
	numUnits: number,
	ticker: string,
	close?: number,
	profit_loss?: number
};

type SellObject = {
	name: string,
	units: number,
	portfolio: string,
	ticker: string,
};

const PortfoliosItem: React.FC<ItemProps> =
	({ name, data, onEnd, handleSell }) => {
		const styles = useStyles();
		const [sellAmountDialog, setSellAmountDialog] = useState(false);
		const [sellAmount, setSellAmount] = useState(1);

		const [, drag] = useDrag({
			type: 'tableRow',
			item: { name, data },
			end: (item: { name: string, data: Stock }, monitor): void => {
				const dropResult:
					{ name: string } | null = monitor.getDropResult();
				if (item && dropResult) {
					onEnd(dropResult.name, item);
				}
			},
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
				handlerId: monitor.getHandlerId(),
			}),
		});

		const handleSellOpen = (): void => {
			setSellAmountDialog(true);
		};

		return (
			<>
				<TableRow
					ref={drag}
					sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
				>
					<TableCell>
						{data.name}
					</TableCell>
					<TableCell component="th" scope="data">
						{data.ticker}
					</TableCell>
					<TableCell align="center">
						{'$' + data.averagePrice.toFixed(2)}
					</TableCell>
					<TableCell align="center">
						{data.numUnits.toFixed(2)}
					</TableCell>
					<TableCell align="center">
						{'$' + (data.averagePrice * data.numUnits).toFixed(2)}
					</TableCell>
					<TableCell align="center" className={data.profit_loss && data.profit_loss > 0 ? styles.profit : styles.loss}>
						{data.profit_loss ? '$' + data.profit_loss.toFixed(2) : ''}
					</TableCell>
					<TableCell align="center">
						<Button className={styles.create_btn} variant="contained" onClick={handleSellOpen}>Sell</Button>
					</TableCell>
				</TableRow>

				<Dialog
					open={sellAmountDialog}
					aria-labelledby="sellamount"
				>
					<DialogTitle id="sellamount">
						<DialogContent>
							<TextField
								id="outlined-number"
								label="Amount"
								type="number"
								value={sellAmount}
								onChange={
									(e): void =>
										setSellAmount(
											parseInt(e.target.value, 10))
								}
								required
								fullWidth
							/>
						</DialogContent>
					</DialogTitle>
					<DialogActions>
						<Button
							className={styles.create_btn} variant="contained"
							onClick={(): void => setSellAmountDialog(false)}
						>
							Cancel
						</Button>
						<Button
							className={styles.create_btn} variant="contained"
							onClick={(): void => {
								handleSell(
									{
										name: data.name,
										units: sellAmount,
										portfolio: name,
										ticker: data.ticker
									}, (): void => {
										setSellAmount(1);
										setSellAmountDialog(false);
									});
							}} autoFocus>
							Confirm
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	};

export default PortfoliosItem;