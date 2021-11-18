import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { useStyles } from '../styles/portfolios.style';
import PortfoliosContent from './PortfoliosContent';


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

type SellObject = {
  name: string,
  units: number,
  portfolio: string,
  ticker: string,
};

const Portfolios: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const { setToast } = bindActionCreators(actionCreators, dispatch);
  const styles = useStyles();
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

      if (response.status === 200) {
        const res = await response.json();
        setPortfoliosList(res);
        let tickerList: string[] = [];
        res.forEach((i: { name: string, stocks: Array<Stock> }) => {
          i.stocks.forEach((j: Stock) => {
            tickerList.push(j.ticker);
          });
        });
        if (tickerList.length !== 0) {
          fetchTickerInfo([...new Set(tickerList)]);
        }
      } else {
        throw new Error('Error');
      }

    } catch (error) {
      setToast({ type: 'error', message: `${error}` });
    }
  };

  const fetchTickerInfo = async (data: Array<string>): Promise<void> => {
    try {
      data.forEach((symbol, index) => {
        if (symbol === 'BINANCE:BTCUSDT') {
          data[index] = 'BTC/USD';
        } else if (symbol === 'BINANCE:ETHUSDT') {
          data[index] = 'ETH/USD';
        }
      });
      const response = await fetch(`https://api.twelvedata.com/time_series?symbol=${data.join(',')}&interval=1min&apikey=6910ca26066d4c8e92f91201d762c60f`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
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
                j.profit_loss = (j.close - j.averagePrice) * j.numUnits;
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
                let value;
                if (j.ticker === 'BINANCE:BTCUSDT') {
                  value = res['BTC/USD'];
                } else if (j.ticker === 'BINANCE:ETHUSDT') {
                  value = res['ETH/USD'];
                } else {
                  value = res[j.ticker];
                }
                if (value.status === 'ok') {
                  j.close = value ? Number(value.values[0].close) : 0;
                  j.profit_loss = (j.close - j.averagePrice) * j.numUnits;
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
      } else {
        throw new Error('Error');
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

      if (response.status === 200) {
        setToast({ type: 'success', message: `Move successfully` });
        setAmount(1);
        setAmountDialog(false);
        setCurrentMoveData({
          oldPortfolioName: '',
          newPortfolioName: '',
          ticker: '',
        });
        fetchPortfoliosList();
      } else {
        throw new Error('Cannot Move Units');
      }

    } catch (error) {
      setToast({ type: 'error', message: `${error}` });
    }
  };

  const handleCreate = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
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

      if (response.status === 201) {
        setToast({ type: 'success', message: `A New Portfolio Built` });
        fetchPortfoliosList();
      } else {
        throw new Error('Existing Portfolio Name');
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

      if (response.status === 200) {
        setToast({ type: 'success', message: `Delete a Portfolio successfully` });
        fetchPortfoliosList();
      } else {
        throw new Error('Error');
      }

    } catch (error) {
      setToast({ type: 'error', message: `${error}` });
    }
  };

  const handleSell: (data: SellObject, callback: () => void) =>
    Promise<void> = async (data, callback) => {
      try {
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

        if (response.status === 200) {
          setToast({ type: 'success', message: `Trade successfully` });
          callback();
          fetchPortfoliosList();
        } else {
          throw new Error('Error');
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
            padding: '10px 48px',
            display: 'flex',
            alignItems: 'center'
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleCreate}
        >
          <span className={styles.label}>Create</span>
          <TextField id="outlined-basic" label="name" variant="outlined" value={[portfoliosName]} onChange={(e): void => { setPortfoliosName(e.target.value); }} />
          <Button type="submit" className={styles.create_btn} variant="contained">Create</Button>
        </Box>
        <DndProvider backend={HTML5Backend}>
          <Box sx={{ flexGrow: 1, padding: '48px' }}>
            <Grid container spacing={2}>
              {portfoliosList.map(item => {
                return (
                  <Grid key={item.name} item xs={12}>
                    <PortfoliosContent
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
            className={styles.create_btn} variant="contained"
            onClick={(): void => setAmountDialog(false)}
          >
            Cancel
          </Button>
          <Button
            className={styles.create_btn} variant="contained"
            onClick={handleMove} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Portfolios;