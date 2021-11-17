import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDrop } from 'react-dnd';
import { useStyles } from '../styles/portfolios.style';
import PortfoliosItem from './PortfoliosItem';

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

const PortfoliosContent: React.FC<Props> =
	({ data, onChange, onDelete, handleSell }) => {
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
				{name !== 'Default' && <Button className={styles.label} variant="outlined" onClick={(): void => onDelete(name)}>Delete</Button>}
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
				<span className={data.total && data.total > 0 ? styles.profit : styles.loss}>profit/loss:{data.total ? data.total.toFixed(2) : ""}</span>
			</Stack>
		</Stack >;
	};

export default PortfoliosContent;