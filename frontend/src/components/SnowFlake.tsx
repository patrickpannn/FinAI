// <block:setup:1>
import React, { useState } from 'react';
import { Radar } from 'react-chartjs-2';

import { useStyles } from '../styles/snowflake.style';
interface Props {
    // value: number, 
    // future: number,
    // past: number,
    // health: number,
    // divident: number
}

const SnowFlake: React.FC<Props> = () => {
    const styles = useStyles();
    const [value, setValue] = useState(0);
    const [future, setFuture] = useState(0);
    const [past, setPast] = useState(0);
    const [health, setHealth] = useState(0);
    const [divident, setDivident] = useState(0);

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
