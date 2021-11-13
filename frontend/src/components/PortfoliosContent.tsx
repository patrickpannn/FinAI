import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import {
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDrag, useDrop } from 'react-dnd';
import { useStyles } from '../styles/portfolios.style';

interface Props {
	data: ContentItem
	onChange: (name: string, data: { name: string, data: Stock }) => void
	onDelete: (name: string) => void
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

type ContentItem = {
	name: string,
	stocks: Array<Stock>
	total?: number
};

type SellObject = {
	name: string,
	units: number,
	portfolio: string,
	ticker: string,
};

const PortfoliosContent: React.FC<Props> = ({ data, onChange, onDelete, handleSell }) => {
	const styles = useStyles();
	const { name, stocks } = data;
	const [, drop] = useDrop({
		accept: 'tableRow',
		drop: (): { name: string } => ({ name }),
		collect: (monitor): { isOver: boolean, canDrop: boolean } => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	});

	return <Stack ref={drop} className={styles.content} spacing={2}>
		<Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
			<span>{name}</span>
			{name !== 'Default' && <Button onClick={(): void => onDelete(name)}>Delete</Button>}
		</Stack>
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Ticker</TableCell>
						<TableCell align="center">AveragePrice</TableCell>
						<TableCell align="center">Units</TableCell>
						<TableCell align="center">TotalValue</TableCell>
						<TableCell align="center">Profit/Loss</TableCell>
						<TableCell align="center">Option</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{stocks.map((row) => (
						<PortfoliosItem
							key={row.ticker}
							name={name}
							data={row}
							onEnd={onChange}
							handleSell={handleSell} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
		<Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
			<span className={data.total && data.total > 0 ? styles.profit : styles.loss}>profit/loss:{data.total ? data.total.toFixed(3) : ""}</span>
		</Stack>
	</Stack>;
};


interface ItemProps {
	name: string,
	data: Stock,
	onEnd: (name: string, data: { name: string, data: Stock }) => void
	handleSell: (data: SellObject, callback: () => void) => Promise<void>
}

const PortfoliosItem: React.FC<ItemProps> = ({ name, data, onEnd, handleSell }) => {
	const styles = useStyles();
	const [sellAmountDialog, setSellAmountDialog] = useState(false);
	const [sellAmount, setSellAmount] = useState(1);

	const [, drag] = useDrag({
		type: 'tableRow',
		item: { name, data },
		end: (item: { name: string, data: Stock }, monitor): void => {
			const dropResult: { name: string } | null = monitor.getDropResult();
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
				<TableCell align="center">{'$' + data.averagePrice}</TableCell>
				<TableCell align="center">{data.numUnits}</TableCell>
				<TableCell align="center">{'$' + data.averagePrice * data.numUnits}</TableCell>
				<TableCell align="center" className={data.profit_loss && data.profit_loss > 0 ? styles.profit : styles.loss}>{data.profit_loss ? '$' + data.profit_loss.toFixed(3) : ''}</TableCell>
				<TableCell align="center"><Button onClick={handleSellOpen}>Sell</Button></TableCell>
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
								(e): void => setSellAmount(parseInt(e.target.value, 10))
							}
							required
							fullWidth
						/>
					</DialogContent>
				</DialogTitle>
				<DialogActions>
					<Button
						onClick={(): void => setSellAmountDialog(false)}
					>
						Cancel
					</Button>
					<Button onClick={(): void => {
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

export default PortfoliosContent;