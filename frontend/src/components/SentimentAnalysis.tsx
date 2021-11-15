import React from 'react';
import SentimentIndicator from './SentimentIndicator';

const SentimentAnalysis: React.FC = () => {
    return (
        <div>
            <h2>Sentiment Score</h2>
            <SentimentIndicator />
        </div>
    );
};

export default SentimentAnalysis;
