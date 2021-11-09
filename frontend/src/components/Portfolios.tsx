import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

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

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { useStyles } from '../styles/portfolios.style';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';

interface Props { }

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

interface ContentProps {
  data: ContentItem
  onChange: (name: string, data: { name: string, data: Stock }) => void
  onDelete: (name: string) => void
  handleSell: (data: SellObject, callback: () => void) => Promise<void>
}
interface ItemProps {
  name: string,
  data: Stock,
  onEnd: (name: string, data: { name: string, data: Stock }) => void
  handleSell: (data: SellObject, callback: () => void) => Promise<void>
}

const Content: React.FC<ContentProps>
  = ({ data, onChange, onDelete, handleSell }) => {
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
              <Item
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


const Item: React.FC<ItemProps> = ({ name, data, onEnd, handleSell }) => {
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

const Portfolios: React.FC<Props> = () => {
  const dispatch = useDispatch();

  const { setToast } = bindActionCreators(actionCreators, dispatch);
  const [amountDialog, setAmountDialog] = useState(false);
  const [amount, setAmount] = useState(1);
  const [portfoliosName, setPortfoliosName] = useState('');
  const [portfoliosList, setPortfoliosList] =
    useState<Array<{ name: string, stocks: Array<Stock>, total?: number }>>([]);
  const [currentMoveData, setCurrentMoveData] = useState({
    oldPortfolioName: '',
    newPortfolioName: '',
    ticker: '',
  });

  useEffect(() => {
    fetchPortfoliosList();
    //eslint-disable-next-line
  }, []);

  const fetchPortfoliosList = async (): Promise<void> => {
    try {
      const response = await fetch(`${url}/user/portfolio/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
        },
      });

      if (response.status === 400) {
        throw new Error('Error');
      } else {
        const res = await response.json();
        setPortfoliosList(res);
        let tickerList: string[] = [];
        res.forEach((i: { name: string, stocks: Array<Stock> }) => {
          i.stocks.forEach((j: Stock) => {
            tickerList.push(j.ticker);
          });
        });
        fetchTickerInfo([...new Set(tickerList)]);
      }

    } catch (error) {
      setToast({ type: 'error', message: `${error}` });
    }
  };

  const fetchTickerInfo = async (data: Array<string>): Promise<void> => {
    try {
      const response = await fetch(`https://api.twelvedata.com/time_series?symbol=${data.join(',')}&interval=1min&apikey=6910ca26066d4c8e92f91201d762c60f`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 400) {
        throw new Error('Error');
      } else {
        const res = await response.json();
        if (res.status && res.status === 'error') {
          setToast({ type: 'error', message: `${res.message}` });
          return;
        }
        setPortfoliosList((prev) => {
          if (res.status === 'ok') {
            prev.forEach((i:
              {
                name: string,
                stocks: Array<Stock>,
                total?: number
              }) => {
              let total: number = 0;
              i.stocks.forEach((j: Stock) => {
                j.close = Number(res.values[0].close);
                j.profit_loss = j.close - j.averagePrice;
                total += j.profit_loss;
              });
              i.total = total;
            });
          } else {
            prev.forEach((i:
              {
                name: string,
                stocks: Array<Stock>,
                total?: number
              }) => {
              let total: number = 0;
              i.stocks.forEach((j: Stock) => {
                const value = res[j.ticker];
                if (value.status === 'ok') {
                  j.close = value ? Number(value.values[0].close) : 0;
                  j.profit_loss = j.close - j.averagePrice;
                } else {
                  j.close = 0;
                  j.profit_loss = 0;
                }
                total += j.profit_loss;
              });
              i.total = total;
            });
          }
          return prev.slice();
        });
      }

    } catch (error) {
      setToast({ type: 'error', message: `${error}` });
    }
  };

  const handleChange =
    (name: string, result: { name: string, data: Stock }): void => {
      if (name === result.name) {
        return;
      }

      setCurrentMoveData({
        oldPortfolioName: result.name,
        newPortfolioName: name,
        ticker: result.data.ticker,
      });
      setAmountDialog(true);
    };

  const handleMove = async (): Promise<void> => {
    try {
      const response = await fetch(`${url}/user/portfolio/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          oldPortfolioName: currentMoveData.oldPortfolioName,
          newPortfolioName: currentMoveData.newPortfolioName,
          ticker: currentMoveData.ticker,
          amount,
        })
      });

      if (response.status === 400) {
        throw new Error('Error');
      } else {
        setToast({ type: 'success', message: `Move successfully` });
        setAmount(1);
        setAmountDialog(false);
        setCurrentMoveData({
          oldPortfolioName: '',
          newPortfolioName: '',
          ticker: '',
        });
        fetchPortfoliosList();
      }

    } catch (error) {
      setToast({ type: 'error', message: `${error}` });
    }
  };

  const handleCreate = async (): Promise<void> => {
    try {
      const response = await fetch(`${url}/user/portfolio/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          name: portfoliosName
        })
      });

      if (response.status === 400) {
        throw new Error('Error');
      } else {
        setToast({ type: 'success', message: `A New Portfolio Built` });
        fetchPortfoliosList();
      }

    } catch (error) {
      setToast({ type: 'error', message: `${error}` });
    }
  };

  const handleDelete = async (name: string): Promise<void> => {
    try {
      const response = await fetch(`${url}/user/portfolio/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          name
        })
      });

      if (response.status === 400) {
        throw new Error('Error');
      } else {
        setToast({ type: 'success', message: `Delete a Portfolio successfully` });
        fetchPortfoliosList();
      }

    } catch (error) {
      setToast({ type: 'error', message: `${error}` });
    }
  };

  const handleSell: (data: SellObject, callback: () => void) =>
    Promise<void> = async (data, callback) => {
      try {
        console.log(data);
        const response = await fetch(`${url}/user/order/sellMarketOrder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
          },
          body: JSON.stringify({
            units: data.units,
            portfolio: data.portfolio,
            ticker: data.ticker,
            name: data.name
          })
        });

        if (response.status === 400) {
          throw new Error('Error');
        } else {
          setToast({ type: 'success', message: `Trade successfully` });
          callback();
          fetchPortfoliosList();
        }

      } catch (error) {
        setToast({ type: 'error', message: `${error}` });
      }
    };

  return (
    <>
      <Container
        maxWidth="xl"
      >
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1 },
            margin: '20px 0',
            display: 'flex',
            alignItems: 'center'
          }}
          noValidate
          autoComplete="off"
        >
          <span>Create</span>
          <TextField id="outlined-basic" label="name" variant="outlined" value={[portfoliosName]} onChange={(e): void => { setPortfoliosName(e.target.value); }} />
          <Button onClick={handleCreate}>Create</Button>
        </Box>
        <DndProvider backend={HTML5Backend}>
          <Box sx={{ flexGrow: 1, padding: '48px' }}>
            <Grid container spacing={2}>
              {portfoliosList.map(item => {
                return (
                  <Grid key={item.name} item xs={12}>
                    <Content
                      data={item}
                      onChange={handleChange}
                      onDelete={handleDelete}
                      handleSell={handleSell} />
                  </Grid>);
              })}
            </Grid>
          </Box>
        </DndProvider>
      </Container>

      <Dialog
        open={amountDialog}
        aria-labelledby="amount"
      >
        <DialogTitle id="amount">
          <DialogContent>
            <TextField
              id="outlined-number"
              label="Amount"
              type="number"
              value={amount}
              onChange={
                (e): void => setAmount(parseInt(e.target.value, 10))
              }
              required
              fullWidth
            />
          </DialogContent>
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={(): void => setAmountDialog(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleMove} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Portfolios;