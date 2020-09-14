from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS 
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import time
from matplotlib import cm
import matplotlib.dates as mdates
import  netCDF4

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'test'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/climateDB'

mongo = PyMongo(app)
CORS(app)


result = []
@app.route('/api/tmean', methods=['GET'])

def get_value():
    tmp = mongo.db.test 
    
    for field in tmp.find().limit(366):
        date = field['date']
        result.append({"s300201": field['300201'],"s432301": field['432301'],"day":field['day'],"month":field['month'],"date": date.strftime("%Y-%m-%d") })

    return jsonify(result)

@app.route('/api/meantem', methods=['GET'])
def meantem():
    tmp = mongo.db.test 
    t = tmp.find()
    t = list(t)
    df = pd.DataFrame(t)    
    groups = df.groupby('month').mean()
    groups2 = groups.to_json()
    print(type(groups2))
    return groups2

@app.route('/api/plot', methods=['GET'])
def plot():
    df = pd.read_csv('C:/Mew/Project/tmp_2012-2016/tmean_2012-2015_d.csv', index_col=-1, parse_dates=True)
    new_df = df.iloc[:, 0:7]
        # print(new_df)
    pt = pd.pivot_table(new_df, index=new_df.index.month, columns=new_df.index.year, aggfunc='mean')
    
    pt.columns = pt.columns.droplevel() # remove the double header (0) as pivot creates a multiindex.
    a = pt.iloc[:,0:4]

    list1 = []
    for i in range(len(a)):
        list1.append({'y2012': a.values[i][0], 'y2013': a.values[i][1], 'y2014': a.values[i][2], 'y2015': a.values[i][3]})
    
    return jsonify(list1)

#----------------------------------------------------------------------------------------------------------------------
result = []
@app.route('/api/testcode', methods=['GET'])
def get_latlon():
    tmp = mongo.db.station 
    for field in tmp.find().limit(10):
        result.append({"code": field['code'], "lat": field['lat'], "lon": field['lon'] })
        print(field)
    return jsonify(result)
    
if __name__ == '__main__':
    app.run(debug=True, port= 5500)


