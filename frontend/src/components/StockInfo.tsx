import React, { useEffect, useCallback, useState } from 'react';
import { StockInfoBox } from '../styles/stock.style';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';

interface Props {
    ticker: string,
}

const StockInfo: React.FC<Props> = ({ ticker }) => {
    const dispatch = useDispatch();
    const { setToast } = bindActionCreators(actionCreators, dispatch);
    const [low, setLow] = useState<number>();
    const [high, setHigh] = useState<number>();
    const [marketCap, setMarketCap] = useState<number>();
    const [pe, setPe] = useState<number>();
    const [profitMargin, setProfitMargin] = useState<number>();
    const [roe, setRoe] = useState<number>();
    const [isCrypto, setIsCrypto] = useState(false);

    const fetchStockInfo = useCallback(async (): Promise<void> => {
        try {
            setPe(undefined);
            setProfitMargin(undefined);
            setRoe(undefined);
            const newTicker = ticker.includes('BTC') ? 'bitcoin' : 'ethereum';
            setIsCrypto(ticker.includes('BINANCE'));

            let response = null;
            if (ticker.includes('BINANCE')) {
                response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${newTicker}&order=market_cap_desc&per_page=100&page=1&sparkline=false`, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json'
                    }
                });

            } else {
                response = await fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=c5vln0iad3ibtqnna830`, {
                    method: 'GET',
                });
            }

            if (response !== null && response.status === 200) {
                const data = await response.json();
                if (ticker.includes('BINANCE')) {
                    setLow(data[0].low_24h);
                    setHigh(data[0].high_24h);
                    setMarketCap(
                        parseInt((data[0].market_cap / 1000000).toFixed())
                    );
                } else {
                    setLow(data.metric['52WeekLow']);
                    setHigh(data.metric['52WeekHigh']);
                    setMarketCap(data.metric.marketCapitalization);
                    setPe(data.metric.peBasicExclExtraTTM !== null
                        ? data.metric.peBasicExclExtraTTM
                        : -1
                    );
                    setRoe(data.metric.roeTTM !== null
                        ? data.metric.roeTTM
                        : -1
                    );
                    setProfitMargin(!Object.keys(data.series).length
                        ? -1
                        : data.series.annual.netMargin[0].v * 100
                    );
                }
            } else {
                throw new Error("Cannot fetch!!");
            }
        } catch (e) {
            setToast({ type: "error", message: `${e}` });
        }
        // eslint-disable-next-line
    }, [ticker]);

    useEffect(() => {
        fetchStockInfo();
    }, [fetchStockInfo]);

    return (
        <StockInfoBox>
            <div>{isCrypto ? '24-hour' : '52-week'} low: {low}</div>
            <div>{isCrypto ? '24-hour' : '52-week'} high: {high}</div>
            <div>Market Cap: ${marketCap?.toLocaleString()}M</div>
            {pe &&
                <div>PE ratio: {pe === -1 ? 'N/A' : `${pe.toFixed(2)}%`}</div>
            }
            {roe &&
                <div>ROE: {roe === -1 ? 'N/A' : `${roe.toFixed(2)}%`}</div>
            }
            {profitMargin &&
                <div>Profit Margin: {profitMargin === -1 ? 'N/A' : `${profitMargin.toFixed(2)}%`}</div>
            }
        </StockInfoBox>
    );
};

export default StockInfo;
