import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, Box } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { useStyles } from '../styles/watchlist.style';

export interface Item {
    itemName: string;
}

interface Props {
    name: string,
}

// Given the company name of a stock, 
// return all the related news including the news headline, abstract and lead paragraphy form NYTimes times
const News: React.FC<Props> = ({ name }) => {
    const styles = useStyles();
    const [articles, setArticles] = useState([]);
    
    const fetchArticles = useCallback(async () : Promise<() => void> => {
        let mounted = true;
        try { 
            const res = await fetch(
                `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${name}&api-key=znXpYECdWv26apkWSTwsYGCASnnu6bDu`
            );
            const data = await res.json();
            if (mounted) {
                setArticles(data.response.docs);
            }    
        } catch (error) {
            console.error(error);
        }
        return (): void => {
            mounted = false;
        };
    }, [name]);

    useEffect(() => {
        setArticles([]);
        fetchArticles();
    },[fetchArticles]);

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