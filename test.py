import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import datetime
import time
from matplotlib import cm
from flask import Flask, jsonify, request,send_from_directory
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS 

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'station'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/cli'

mongo = PyMongo(app)
CORS(app)

# @app.route('/api/plot', methods=['GET'])
# def plot():
#     df = pd.read_csv('C:/Users/ice/Documents/climate/TMD_DATA-20200902T042020Z-001/TMD_DATA/clean_data/tmean_2012-2015_d.csv', index_col=-1, parse_dates=True)
#     new_df = df.iloc[:, 0:7]
#         # print(new_df)
#     pt = pd.pivot_table(new_df, index=new_df.index.month, columns=new_df.index.year, aggfunc='mean')
#     pt.columns = pt.columns.droplevel() # remove the double header (0) as pivot creates a multiindex.
#     a = pt.iloc[:,0:4]
#     list1 = []
#     for i in range(len(a)):
#         list1.append({'y2012': a.values[i][0], 'y2013': a.values[i][1], 'y2014': a.values[i][2], 'y2015': a.values[i][3]})
#     return jsonify(list1)

# if __name__ == '__main__':
#     app.run(debug=True, port= 5500)

result = []
@app.route('/api/testcode', methods=['GET'])
def get_value():
    tmp = mongo.db.station 
    for field in tmp.find().limit(10):
        result.append({"code": field['code'], "lat": field['lat'], "lon": field['lon'] })
        print(field)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port= 5000)