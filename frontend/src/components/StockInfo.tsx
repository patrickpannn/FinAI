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

    const fetchStockInfo = useCallback(async (): Promise<void> => {
        try {
            const newTicker = ticker.includes('BINANCE') ? `${ticker.split('BINANCE:')[1]}:BINANCE` : ticker;
            console.log(newTicker);
            // const response = await fetch(`https://api.twelvedata.com/statistics?symbol=ETH/BTC:Huobi&apikey=6910ca26066d4c8e92f91201d762c60f`, {
            //     method: 'GET',
            // });
            // const response = await fetch(`https://finnhub.io/api/v1/stock/metric?symbol=BINANCE:BTC/USDT&metric=all&token=c5vln0iad3ibtqnna830`, {
            //     method: 'GET',
            // });
            const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical?CMC_PRO_API_KEY=c1ed4728-32c5-4759-84d7-4b21cfd22188`, {
                method: 'GET',
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log(data);
                // setLow(data.statistics.stock_price_summary.fifty_two_week_low);
                // setHigh(data.statistics.stock_price_summary.fifty_two_week_high);
                // setMarketCap(data.statistics.valuations_metrics.market_capitalization);
                // setPe(data.statistics.valuations_metrics.forward_pe);
                // setProfitMargin(data.statistics.financials.profit_margin * 100);
                // setRoe(data.statistics.financials.return_on_equity_ttm * 100);
            } else {
                throw new Error("Cannot fetch!!");
            }

        } catch (e) {
            setToast({ type: "error", message: `${e}` });
        }

    }, [ticker]);

    useEffect(() => {
        fetchStockInfo();
    }, [fetchStockInfo]);

    return (
        <StockInfoBox>
            <div>52-week low: {low}</div>
            <div>52-week high: {high}</div>
            <div>Market Cap: {marketCap}</div>
            {pe && <div>PE ratio: {pe.toFixed(2)}%</div>}
            {roe && <div>ROE: {roe.toFixed(2)}%</div>}
            {profitMargin && <div>Profit Margin: {profitMargin.toFixed(2)}%</div>}
        </StockInfoBox>
    );
};

export default StockInfo;
