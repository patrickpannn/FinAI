import React, { useState } from 'react';
import { Step, Indicator, useStyles, StepGroup, Labels, StyledDrop } from '../styles/analysis.style';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const SentimentIndicator: React.FC = () => {
    const styles = useStyles();
    const [score, setScore] = useState(50);
    const [dropColor, setDropColor] = useState("#f1bc00");
    const [colors, setColors] = useState([
        "#d12000",
        "#ed8d00",
        "#f1bc00",
        "#84c42b",
        "#3da940",
    ]);

    return (
        <Indicator>
            {/* <ArrowDropDownIcon fontSize='large' className={styles.drop} /> */}
            <StyledDrop score={50} bgcolor="#ed8d00" />
            <StepGroup>
                {colors.map((c) => <Step key={c.replace("#", "")} color={c} />)}
            </StepGroup>
            <Labels>
                <p>negative</p>
                <p>neutral</p>
                <p>positive</p>
            </Labels>
        </Indicator>
    );
};

export default SentimentIndicator;
