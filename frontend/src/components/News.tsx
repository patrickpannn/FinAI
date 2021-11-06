import React, { useState, useEffect } from "react";
import { Card, CardContent, Box } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { useStyles } from '../styles/watchlist.style';

export interface Item {
    itemName: string;
}

interface Props {
    name: string,
}

const News: React.FC<Props> = ({ name }) => {

    const styles = useStyles();
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () : Promise<void> => {
            try { 
                const res = await fetch(
                    `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${name}&api-key=znXpYECdWv26apkWSTwsYGCASnnu6bDu`
                );     
                setArticles((await res.json()).response.docs);
            } catch (error) {
                console.error(error);
            }
        };
        fetchArticles();
    },[name]);

    return (
        
        <div className={styles.newsContainer}>
            {articles.length === 0 
            && <Box className={styles.progressBar}>
                    <LinearProgress />
                </Box>
            }
            
            {articles.map((article)=> {
                const {
                    _id,
                    web_url,
                    headline: { main }, 
                    abstract,
                    lead_paragraph
                } = article;
                return (
                    <article 
                        key={_id}
                    >
                        <Card 
                            variant="outlined"
                            >
                            <CardContent>
                                <a className={styles.cardTitle}
                                    href={web_url} 
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <h2>
                                        {main}
                                    </h2>
                                </a>
                                <p className={styles.cardBody}>
                                    {abstract}
                                </p>
                                <p className={styles.cardBody}>
                                    {lead_paragraph}
                                </p>
                            </CardContent>
                        </Card>
                    </article>  
                );
            })}
        </div>
    );
};
export default News;