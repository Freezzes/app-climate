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
from pymongo import MongoClient
from flask import request
from netCDF4 import Dataset

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'test'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/climateDB'

# client = MongoClient('mongodb://root:example@localhost:27017')
# db = client['climateDB'] 

mongo = PyMongo(app)
CORS(app)
tmp_test = mongo.db.test 

@app.route('/api/tmean', methods=['GET'])
def get_value():
    result = []
    tmp = mongo.db.test 
    for field in tmp.find():
        date = field['date']
        result.append({"s300201": field['300201'],"s432301": field['432301'],"day":field['day'],"month":field['month'],"year":field['year'],"date": date.strftime("%Y-%m-%d") })
    c = list (result)
    c = pd.DataFrame(c)
    print (c)
    return jsonify(result)

@app.route('/api/month', methods=['GET']) 
def get_varmonth():
    result = []
    result1 = []
    result2 = []
    result3 = []
    result4 = []

    tmp = mongo.db.test 
    for field in tmp.find():
        if field['year'] == 2012:
            if field['month'] == 12:
                result1.append({'Dec': field['300201']})
            elif field['month'] == 1:
                result1.append({'Jan': field['300201']})
            elif field['month'] == 2:
                result1.append({'Feb': field['300201']})
            else:
                pass
        elif field['year'] == 2013:
            if field['month'] == 12:
                result2.append({'Dec': field['300201']})
            elif field['month'] == 1:
                result2.append({'Jan': field['300201']})
            elif field['month'] == 2:
                result2.append({'Feb': field['300201']})
            else:
                pass
        elif field['year'] == 2014:
            if field['month'] == 12:
                result3.append({'Dec': field['300201']})
            elif field['month'] == 1:
                result3.append({'Jan': field['300201']})
            elif field['month'] == 2:
                result3.append({'Feb': field['300201']})
            else:
                pass
        elif field['year'] == 2015:
            if field['month'] == 12:
                result4.append({'Dec': field['300201']})
            elif field['month'] == 1:
                result4.append({'Jan': field['300201']})
            elif field['month'] == 2:
                result4.append({'Feb': field['300201']})
            else:
                pass
        else:
                pass
    result.append({2012: result1,2013: result2,2014:result3,2015:result4})
    c = list (result)
    c = pd.DataFrame(c)
    print (type(field['300201']))
    return jsonify(result)
    # groups2 = groups.to_json()
    # print(type(groups2))
    # print(groups2)

@app.route('/api/meantem', methods=['GET'])
def meantem():
    tmp = mongo.db.test 
    t = tmp.find()
    t = list(t)
    df = pd.DataFrame(t)    
    groups = df.groupby('month').mean()
    groups2 = groups.to_json()
    print(type(groups2))
    print(groups2)
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

@app.route('/api/values', methods=['POST']) 
def foo():
    data = request.json
    data_m = data["month"]
    if data_m == "Mar":
        collect = tmp_test["300201"]
        print(collect)
        return {"data":True}
    else:
        return {"data":False}

# ----------------------------------------------------------------------------------------------------------------------
@app.route("/filterData", methods=["POST"])
def query_data():
    station = request.args.get('station')
    month = request.args.get('month')
    year = request.args.get('year') 
    result = getmonth(station, month, year)
    return {"data":result}

def getmonth(station, month, year):
    l = []
    query = mongo.db.test.find({ "$and" : [{ "month" : int(month) }, { "year" : int(year) } ] } ,{station:1})
    for data in query:
        l.append(data[station])
    return l

#----------------------------------------------------------------------------------------------------------------------
@app.route("/netcdf",methods=["POST"])
def get_varlatlon():
    ds = Dataset("C:/Mew/Project/cru_ts4.04.2011.2019.tmp.dat.nc")
    temp = ds.variables['tmp'][:].filled()
    lati = ds.variables['lat'][:]
    lont = ds.variables['lon'][:]
    times = ds.variables['time'][5:6]
    temp = np.where(temp == 9.96921e+36, np.NaN, temp)
    data = []
    for i in range(len(times)) :
        time = times[i]
        for row in range(len(lati)) :
            lat = lati[row]
            for col in range(len(lont)) :
                lon = lont[col]
                x = temp[i, row, col]
                times = np.float64(time)   
                lats = np.float64(lat) 
                lons = np.float64(lon)
                Xs = np.float64(x) 
                data.append({"time":times, "lat":lats, "lon":lons,"X": Xs})
    print(type(lon))
    # print("d")
    return jsonify(data)
##----------------------------------------------------------------------------------------------------------------------------------
def get_latlon():
    ds = Dataset("C:/Mew/Project/cru_ts4.04.2011.2019.tmp.dat.nc")
    temp = ds.variables['tmp'][1:2,:,:].filled()
    lati = ds.variables['lat'][:]
    lont = ds.variables['lon'][:]
    times = ds.variables['time'][1:2]
    # temp = np.where(temp == 9.96921e+36, np.nan, temp)

    data = []
    for i in range(len(times)) :
        time = times[i]
        for row in range(len(lati)) :
            lat = lati[row]
            for col in range(len(lont)) :
                lon = lont[col]
                
                x = temp[i, row, col]
                times = np.float64(time)   
                lats = np.float64(lat) 
                lons = np.float64(lon)
                Xs = np.float64(x) 
                data.append({'time':times,'lat':lats,'lon': lons,'value': Xs})

    return data

datanc = get_latlon()
print(datanc)
@app.route("/test",methods=["GET"])
def get_varnc():
    print("read")
    return jsonify(datanc)
#----------------------------------------------------------------------------------------------------------------------
# result = []
# @app.route('/api/testcode', methods=['GET'])
# def get_latlon():
#     tmp = mongo.db.station 
#     for field in tmp.find().limit(10):
#         result.append({"code": field['code'], "lat": field['lat'], "lon": field['lon'] })
#         print(field)
#     return jsonify(result)
    
if __name__ == '__main__':
    app.run(debug=True, port= 5500)

