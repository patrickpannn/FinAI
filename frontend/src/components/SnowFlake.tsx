// <block:setup:1>
import React, { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { useDispatch } from 'react-redux';
import { useStyles } from '../styles/snowflake.style';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';
interface Props { }

interface Values {
  value: number,
  past: number,
  future: number,
  health: number,
  divident: number
}
const SnowFlake: React.FC<Props> = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { setToast } = bindActionCreators(actionCreators, dispatch);
  const [values, setValues] = useState<Values[]>([]);
  const [value, setValue] = useState(0);
  const [future, setFuture] = useState(0);
  const [past, setPast] = useState(0);
  const [health, setHealth] = useState(0);
  const [divident, setDivident] = useState(0);


  const fetchSnowflake = async (): Promise<void> => {
    try {
        const response = await fetch(`${url}/analysis/snowflake`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
            },
        });
        if (response.status === 200) {
            const data = await response.json();
            setValues(data);
        
        } else {
            throw new Error('Failed to data for snowflake');
        }
    } catch (e) {
        setToast({ type: 'error', message: `${e}` });

    }
  };
  const data = {
      labels: ['Value', 'Future', 'Past', 'Health', 'Divident'],
      datasets: [
        {
          label: 'Value',
          data: [5, 3, 5, 8, 9],
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
                  suggestedMax: 10
              }
          }
    };
    return (
      <div className={styles.chartContainer}>  
          <Radar data={data} options={options} />   
      </div>
    );
};
export default SnowFlake;
