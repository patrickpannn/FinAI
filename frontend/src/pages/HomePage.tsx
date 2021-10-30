import React from 'react';
import { Main, StyledCard } from '../styles/homepage.style';
import Header from '../components/Header';

const HomePage: React.FC = () => {
    return (
        <>
            <Header page={'HOME'} />
            <Main>
                <StyledCard>
                    <h1>Take control of your portfolio.</h1>
                    <h2>Trade US stocks and Crypto with confidence</h2>
                </StyledCard>
            </Main>
        </>
    );
};

export default HomePage;
