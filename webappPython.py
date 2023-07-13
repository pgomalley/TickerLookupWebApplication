#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Jul 10 12:09:48 2023

@author: patrickomalley

"""
import requests 
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

@app.route('/get_data', methods=['GET'])
def get_data():
    ticker = request.args.get('ticker') 
    api_key = 'M4CERU3IZFPOU3E9'
    response = requests.get(f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={ticker}&interval=60min&apikey={api_key}')
    
    data = response.json()

    df = pd.DataFrame(data["Time Series (60min)"]).T
    df.reset_index(inplace=True)

    df.columns = ["timestamp", "open", "high", "low", "close", "volume"]
    df[['open', 'high', 'low', 'close', 'volume']] = df[['open', 'high', 'low', 'close', 'volume']].apply(pd.to_numeric)
    
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['date'] = df['timestamp'].dt.date
    df['time'] = df['timestamp'].dt.time.astype(str) 

    hourly_data = df.to_dict(orient="records")
    
    daily_df = df.groupby('date').agg({'open': 'first', 'high': 'max', 'low': 'min', 'close': 'last', 'volume': 'sum'}).reset_index()

    return jsonify({"dailyData": daily_df.to_dict(orient="records"), "hourlyData": hourly_data})

if __name__ == "__main__":
    app.run(port=5500)


