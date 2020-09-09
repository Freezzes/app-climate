from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS 

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'tmp2011'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/cli'

mongo = PyMongo(app)
CORS(app)

@app.route('/api/tmp2011', methods=['GET'])
def get_value():
    tmp = mongo.db.tmp2011 
    result = [{
        "timeC": "123",
    "lat" : "12",
    "lon" : "2",
    "temp" : "40"
    },
    {
        "timeC": "123",
    "lat" : "12",
    "lon" : "2",
    "temp" : "42"
    }]
    # for field in tmp.find():
    #     result.append({'timeC': str(field['time']), 'lat': field['lat'], 'lon': field['lon'], 'temp': field['temp']})
    return jsonify(result)

#----------------------------------------------------------------------------------------------------------------------

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import time
from matplotlib import cm
import matplotlib.dates as mdates
import  netCDF4


df = pd.read_csv(r'C:/Users/ice/Documents/climate/TMD_DATA-20200902T042020Z-001/TMD_DATA/clean_data/tmean_2012-2015_d.csv', index_col=-1, parse_dates=True)
print(df)
fig, ax = plt.subplots()
ax.plot(df['300201'], color='black', label='300201')
ax.plot(df['451301'], color='red', label='451301')
ax.xaxis.set_major_locator(mdates.YearLocator())
ax.legend()
ax.set_ylabel('Monthly Total (GWh)')
if __name__ == '__main__':
    app.run(debug=True, port= 5500)