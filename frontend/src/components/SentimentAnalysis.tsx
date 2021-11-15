import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';
import { Step, Indicator, StepGroup, useStyles, Labels, StyledDrop } from '../styles/analysis.style';
import CircularProgress from '@mui/material/CircularProgress';

const url = process.env.REACT_APP_URL || 'http://localhost:5000';

interface Props {
    stockName: string,
}

const SentimentAnalysis: React.FC<Props> = ({ stockName }) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const [score, setScore] = useState<number>(0);
    const [dropColor, setDropColor] = useState<string>('');
    const colors = useRef([
        "#d12000",
        "#ed8d00",
        "#f1bc00",
        "#84c42b",
        "#3da940",
    ]);

    const mapToColor = (s: number): void => {
        if (0 <= s && s < 20) {
            setDropColor("#d12000");
        } else if (20 <= s && s < 40) {
            setDropColor("#ed8d00");
        } else if (40 <= s && s < 60) {
            setDropColor("#f1bc00");
        } else if (60 <= s && s < 80) {
            setDropColor("#84c42b");
        } else {
            setDropColor("#3da940");
        }
    };

    const fetchScore = useCallback(async (): Promise<() => void> => {
        let mounted = true;
        try {
            if (stockName) {
                setDropColor('');
                setScore(0);
                console.log(stockName);
                const response = await fetch(`${url}/analysis/sentiment/${stockName}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                    }
                });

                if (response.status === 200) {
                    const data = await response.json();
                    if (mounted) {
                        const newScore = data.score !== undefined
                            ? (data.score + 1) * 50
                            : 50;
                        setScore(newScore);
                        mapToColor(newScore);
                    }
                } else {
                    throw new Error('fetch sentiment score failed');

                }
            }
        } catch (e) {
            setToast({ type: 'error', message: `${e}` });
        }

        return (): void => {
            mounted = false;
        };
        // eslint-disable-next-line
    }, [stockName]);

    useEffect(() => {
        fetchScore();
    }, [fetchScore]);

    return (
        <div>
            <h2 className={styles.label}>Sentiment Score</h2>
            {dropColor === ''
                ? <div className={`${styles.label} ${styles.progressBar}`}><CircularProgress /></div>
                : <Indicator>
                    <StyledDrop score={score} bgcolor={dropColor} />
                    <StepGroup>
                        {colors.current.map((c) => <Step key={c.replace("#", "")} color={c} />)}
                    </StepGroup>
                    <Labels>
                        <p>negative</p>
                        <p>neutral</p>
                        <p>positive</p>
                    </Labels>
                </Indicator>
            }
        </div>
    );
};

export default SentimentAnalysis;

