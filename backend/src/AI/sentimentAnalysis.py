import sys
import requests
import datetime as dt
import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer

class SentimentAnalysis:
    end_date = dt.datetime.today().strftime('%Y%m%d')
    begin_date = (dt.datetime.today() - dt.timedelta(7)).strftime("%Y%m%d")

    def __fetchNews(self):
        res = requests.get(
            f'https://api.nytimes.com/svc/search/v2/articlesearch.json?q={sys.argv[1]}&begin_date={self.begin_date}&end_date={self.end_date}&sort=relevance&api-key=znXpYECdWv26apkWSTwsYGCASnnu6bDu')
        data = res.json()['response']['docs']

        newData = [{
            'Date': doc['pub_date'],
            'Abstract': doc['abstract']
        } for doc in data]

        df = pd.DataFrame(newData)
        df.loc[:, 'Date'] = pd.to_datetime(df['Date'])
        df['Date'] = df['Date'].map(lambda x: x .strftime('%Y-%m-%d %X'))
        df.dropna(inplace=True)
        return df

    def implementation(self):
        try:
            df = self.__fetchNews()
            
            vader = SentimentIntensityAnalyzer()
            scores = df['Abstract'].apply(vader.polarity_scores).tolist()

            scores_df = pd.DataFrame(scores)
            scores_df.rename(columns={'compound': 'score'}, inplace=True)
            scores_df.drop(columns=['neg', 'neu', 'pos'], axis=1, inplace=True);
            print(scores_df.mean().to_json())
        except:
            print('{}')



if __name__ == "__main__":
    sentiment = SentimentAnalysis()
    sentiment.implementation()
