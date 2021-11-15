import React, { useCallback, useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { useDispatch } from 'react-redux';
import { useStyles } from '../styles/snowflake.style';
import CircularProgress from '@mui/material/CircularProgress';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';
interface Props { 
    ticker: string,
}

const SnowFlake: React.FC<Props> = ({ ticker }) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const [hasData, setHasData] = useState(false);
    const [value, setValue] = useState(0);
    const [past, setPast] = useState(0);
    const [future, setFuture] = useState(0);
    const [risk, setRisk] = useState(0);
    const [divident, setDivident] = useState(0);
    const [display, setDisplay] = useState(false);

    const fetchSnowflake = useCallback(async (): Promise<void> => {
        try {
            if (ticker === 'BINANCE:BTCUSDT' || ticker === 'BINANCE:ETHUSDT') {
                setDisplay(false);
            } else {
                setHasData(false);
                const response = await fetch(`${url}/analysis/snowflake`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
                    },
                    body: JSON.stringify({
                        ticker
                    })
                });
                if (response.status === 200) {
                    const data = await response.json();
                    setHasData(true);
                    setDisplay(true);
                    setValue(data.value);
                    setPast(data.past);
                    setFuture(data.future);
                    setRisk(data.risk);
                    setDivident(data.divident);
                } else {
                    throw new Error('Failed to fetch data for snowflake');
                }
            }
            
        } catch (e) {
            setToast({ type: 'error', message: `${e}` });
        }
       // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchSnowflake();
    }, [fetchSnowflake]);
    
    const data = {
        labels: ['Value', 'Future', 'Past', 'Risk', 'Divident'],
        datasets: [
          {
            label: 'Value',
            data: [value, past, future, risk, divident],
            fill: true, 
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderColor: 'rgb(54, 162, 215)',
            borderWidth: 3,
            tension: 0.1,
          },
        ],
      };
      
    const options = {
        scales: {
            r: {
                suggestedMin: 0,
                suggestedMax: 1
            }
        }
    };

    return (
        <div>
        {display && !hasData && <h1><CircularProgress /></h1>}
        {display && hasData &&
            <div className={styles.chartContainer}>  
                <Radar data={data} options={options} />   
            </div>
        }
        </div>
    );
};
export default SnowFlake;
