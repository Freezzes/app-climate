from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import time
import json
from matplotlib import cm
import matplotlib.dates as mdates
import netCDF4
from netCDF4 import Dataset
import datetime
import pymongo
from datetime import datetime
import os

from lib.function import range_boxplot,mask_inside_country,mask_inside_continent
from lib.mymongo import Mongo
from lib.Calculate import Calculate_service
from lib.Percent_different import Percent_service
from lib.read_folder import *
# from lib.country import _get_country_mask_arr

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localh ost:27017/Project'

client = pymongo.MongoClient('mongodb://localhost:27017/')
# db = client['test']
database = "test"

mongo = PyMongo(app)
CORS(app)

@app.route("/api/dataset", methods=["GET"])
def get_dataset():
    ds = pd.read_csv(r'C:/Mew/Project/dataset_name.csv')
    res = []
    for i in range(len(ds['id'])):
        res.append({'id': ds['id'][i] , 'name': ds['name'][i] })

    return jsonify(res)
# ----------------------------------------dif-----------------------------------------------
@app.route("/per_dif", methods=["GET"])
def per_dif():
    start = time.time()
    dataset = str(request.args.get("ncfile"))
    index = str(request.args.get("df_f"))
    start1 = int(request.args.get("start1"))
    stop1 = int(request.args.get("stop1"))
    start2 = int(request.args.get("start2"))
    stop2 = int(request.args.get("stop2"))
    f = read_folder_dif(dataset, index, start1, stop1,start2,stop2)
 
    V = []
    for i in range(len(f[0])):
        ds = np.load(f[0][i])
        val = ds['value'][:]
        val = np.mean(val, axis = 0)#.flatten()
        V.append(val)
    res = np.nanmean(V[:], axis = 0)#.flatten()
    range1 = res.flatten()
    val1 = np.where(np.isnan(range1), None, range1)

    V1 = []
    for i in range(len(f[1])):
        ds = np.load(f[1][i])
        val = ds['value'][:]
        val = np.mean(val, axis = 0)#.flatten()
        V1.append(val)
    res1 = np.nanmean(V1[:], axis = 0)#.flatten()
    range2 = res1.flatten()
    val2 = np.where(np.isnan(range2), None, range2)

    dif = np.subtract(res1,res)
    per = ((dif/res)*100).flatten()
    per1 = np.where(np.isnan(per), None, per)
    
    Min , Max = range_boxplot(per,index)
    Min1 , Max1 = range_boxplot(range1,index)
    Min2 , Max2 = range_boxplot(range2,index)

    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]
  
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'
  
    return jsonify(y.tolist(),x.tolist(),per1.tolist(),Min,Max,lon_step,lat_step,color,)

@app.route("/raw_dif", methods=["GET"])
def raw_dif():
    start = time.time()
    dataset = str(request.args.get("ncfile"))
    index = str(request.args.get("df_f"))
    start1 = int(request.args.get("start1"))
    stop1 = int(request.args.get("stop1"))
    start2 = int(request.args.get("start2"))
    stop2 = int(request.args.get("stop2"))
    f = read_folder_dif(dataset, index, start1, stop1,start2,stop2)
    
    V = []
    for i in range(len(f[0])):
        ds = np.load(f[0][i])
        val = ds['value'][:]
        val = np.mean(val, axis = 0)#.flatten()
        V.append(val)
    res = np.nanmean(V[:], axis = 0)#.flatten()

    V1 = []
    for i in range(len(f[1])):
        ds = np.load(f[1][i])
        val = ds['value'][:]
        val = np.mean(val, axis = 0)#.flatten()
        V1.append(val)
    res1 = np.nanmean(V1[:], axis = 0)#.flatten()
  
    raw = np.subtract(res1,res).flatten()
    raw1 = np.where(np.isnan(raw), None, raw)

    Min , Max = np.float64(range_boxplot(raw,index))

    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]
  
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return jsonify(y.tolist(),x.tolist(),raw1.tolist(),Min,Max,lon_step,lat_step,color,)

# ----------------------------------map different-----------------------------------------
@app.route("/map_range1", methods=["GET"])
def map_range1():
    start = time.time()
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    start = int(request.args.get("start"))
    stop = int(request.args.get("stop"))
    f = read_folder(dataset, index, start, stop)
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        val = ds['value'][:]
        val = np.mean(val, axis = 0)#.flatten()
        V.append(val)
    res = np.nanmean(V[:], axis = 0)#.flatten()
    range1 = res.flatten()
    val1 = np.where(np.isnan(range1), None, range1)

    Min , Max = np.float64(range_boxplot(range1,index))
    
    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]
  
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'
    
    return jsonify(y.tolist(),x.tolist(),val1.tolist(),Min,Max,lon_step,lat_step,color)

@app.route("/map_range2", methods=["GET"])
def map_range2():
    start = time.time()
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    start = int(request.args.get("start"))
    stop = int(request.args.get("stop"))
    f = read_folder(dataset, index, start, stop)
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        val = ds['value'][:]
        val = np.mean(val, axis = 0)#.flatten()
        V.append(val)
    res = np.nanmean(V[:], axis = 0)#.flatten()
    range1 = res.flatten()
    val1 = np.where(np.isnan(range1), None, range1)

    Min , Max = np.float64(range_boxplot(range1,index))
    
    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]
   
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'
    
    return jsonify(y.tolist(),x.tolist(),val1.tolist(),Min,Max,lon_step,lat_step,color)

# -------------------------------------hight re-----------------------------------------------------
@app.route('/nc_avg_hire', methods=['GET'])
def get_Avgmap_h():
    start = time.time()
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    f = read_folder_h(dataset, index, startyear, stopyear)
    get_data = select_data_fromdate(f, startyear, stopyear, startmonth, stopmonth)
    lat = get_data[1]
    lon = get_data[2]
    res = np.nanmean(get_data[0][:], axis = 0).flatten() #เฉลี่ยแต่ละจุดของทุกปี shape (จำนวนจุด)
    resp = np.where(np.isnan(res), None, res)
    max_ = np.round(np.nanmax(res), 4)
    Min , Max = range_boxplot(res,index)
    lat_lon_st = lat_lon(lat,lon)  
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'
    # return 'test'
    return jsonify(lat_lon_st.get('lon'),lat_lon_st.get('lat'),resp.tolist(),np.float64(Min),np.float64(Max),lat_lon_st.get('lon_step'),lat_lon_st.get('lat_step'),color)

# ------------------------------Low Re-----------------------------------------------------------------

def get_Avgmap(dataset, index, startyear, stopyear, startmonth, stopmonth):
    start = time.time()
    f = read_folder(dataset, index, startyear, stopyear)
    get_data = select_data_fromdate(f, startyear, stopyear, startmonth, stopmonth)
    lat = get_data[1]
    lon = get_data[2]
    res = np.nanmean(get_data[0][:], axis = 0).flatten() #เฉลี่ยแต่ละจุดของทุกปี shape (จำนวนจุด)
    resp = np.where(np.isnan(res), None, res)
    max_ = np.round(np.nanmax(res), 4)
    Min , Max = range_boxplot(res,index)
    
    lat_lon_st = lat_lon(lat,lon)  
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'
    # return 'test'
    return lat_lon_st.get('lon'),lat_lon_st.get('lat'),resp.tolist(),np.float64(Min),np.float64(Max),lat_lon_st.get('lon_step'),lat_lon_st.get('lat_step'),color

@app.route('/nc_avg', methods=['GET'])
def selectNC():
    ncfile = str(request.args.get("ncfile"))
    df_f = str(request.args.get("df_f"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    a = get_Avgmap(ncfile, df_f, startyear, stopyear, startmonth, stopmonth)
    return jsonify(a)

# --------------------------------station---------------------------------------
@app.route('/locat/station', methods=['GET'])
def locat():
    df_f = str(request.args.get("df_f"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    if df_f == 'tas':
        ds = pd.read_csv(
            "C:/Mew/Project/data_station/Tmean_Station_1951_2015.csv")
        color_map = 'cool_warm'
    elif df_f == 'tasmin':
        ds = pd.read_csv(
            "C:/Mew/Project/data_station/Tmin_Station_1951_2016.csv")
        color_map = 'cool_warm'
    elif df_f == 'tasmax':
        ds = pd.read_csv(
            "C:/Mew/Project/data_station/Tmax_Station_1951_2016.csv")
        color_map = 'cool_warm'
    elif df_f == 'pr':
        ds = pd.read_csv(
            "C:/Mew/Project/data_station/Pr_Station_1951_2018.csv")
        color_map = 'dry_wet'
    elif df_f == 'ec':
        ds = E

    df = pd.read_csv("C:\Mew\Project\data_station\station.csv")
    df['Avg_val'] = ""
    ds['date'] = pd.to_datetime(ds['date'], format='%Y-%m-%d')
    col = ds.columns[3:-1]
    for i in range(len(col)):
        df['Avg_val'][i] = ds.loc[(ds['date'].dt.year >= startyear) & (ds['date'].dt.year <= stopyear) & (
            ds['date'].dt.month >= startmonth) & (ds['date'].dt.month <= stopmonth), col[i]].mean(skipna=True)
    select = df[['id', 'name', 'latitude', 'longitude',
                 'Avg_val']].to_json(orient='records')
    select = json.loads(select)
    return jsonify(select, color_map)

# -------------------------------db---------------------------------------
@app.route("/api/get_db", methods=['GET'])
def get_db():
    start = time.time()
    output = []
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    # stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))

    db = client['Project']
    collection = db[f"{dataset}_{index}"]

    for d in collection.find({'year': startyear, 'month': startmonth}, {'_id': 0}):
        output.append({'values': d['data']})
    # print(output)
    end = time.time()

    return jsonify(output)

@app.route("/api/get_grid", methods=['GET'])
def get_grid():
    start = time.time()
    output = []
    dataset = str(request.args.get("dataset"))
    db = client['Project']
    collection = db['dataset']
    for d in collection.find({'dataset': dataset}, {'_id': 0}):

        output.append({'geojson_gridcenter': d['geojson_gridcenter'],
                       'lon_step': d['gridsize']['lon_step'], 'lat_step': d['gridsize']['lat_step']})
    end = time.time()
    print("get_grid:", end-start)
    return jsonify(output)

@app.route("/api/detail_index", methods=['GET'])
def get_detail():
    output = []
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    db = client['Project']
    collection = db['index_detail']
    for d in collection.find({'index': index}, {'_id': 0}):
        output.append(
            {'definition': d['definition'], 'color_map': d['color_map'],'unit':d['unit'],'type':d['type'],'index':d['index']})
        # print(d['color_map'])

    return jsonify(output)

# -------------------DB Avg-------------------------
@app.route("/api/data_avg", methods=['GET'])
def index_time_range():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    startmonth = int(request.args.get("startmonth"))
    stopyear = int(request.args.get("stopyear"))
    stopmonth = int(request.args.get("stopmonth"))

    year_list = range(int(startyear), int(stopyear)+1)

    db = Mongo(database="Project", collection="{}_{}".format(
        dataset.lower(), index.lower()))
    data = db.find({'year': {"$in":  list(year_list)}})

    n = 12

    # using list comprehension
    final = [data[i * n:(i + 1) * n] for i in range((len(data) + n - 1) // n)]

    obj = Calculate_service(final, int(startyear), int(
        startmonth), int(stopyear), int(stopmonth))
    result = obj.getAverageMap1()

    return jsonify(result)

# --------------------avg global chart-----------------------
@app.route("/api/global_avg", methods=['GET'])
def avg_global_year():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    startmonth = int(request.args.get("startmonth"))
    stopyear = int(request.args.get("stopyear"))
    stopmonth = int(request.args.get("stopmonth"))
    year_list = range(int(startyear), int(stopyear)+1)
    path = f'C:/Mew/Project/{dataset}.avg_global.csv'
    df = pd.read_csv(path)
    if dataset == 'cru_ts':
        start_year = 1901
        end_year = 2019
    else:
        start_year = 1979
        end_year = 2014
    start_index = startyear - start_year
    end_index = stopyear - start_year
    result = df[index][start_index:end_index+1].tolist()
    avg = np.round(np.mean(result), 4)
    if index == 'pr':
        unit = "mm"
    else:
        unit = "°C"

    return jsonify(result, avg, unit)

@app.route("/api/detail", methods=['GET'])
def detail():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    df = pd.read_csv('C:/Mew/Project/index_detail.csv')
    query = df.loc[(df['dataset']==dataset)&(df['index']==index)]
    # res = jsonify(query['long name'][0],query['description'][0],query['unit'][0],query['year'][0])
    # color = jsonify(query['color_map'][0])
    select = query[['long_name','description','unit','year','color_map','dataset']].to_json(orient='records')
    select = json.loads(select)
    return select[0]

@app.route("/api/country_avg",methods=['GET'])
def country_avg():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    country = request.headers.get("country")
    # country = "Libya"
    # print("country :",country)
    f = read_folder(dataset, index, startyear, stopyear)
    data_date = select_data_fromdate(f,startyear,stopyear,startmonth,stopmonth)
    data = mask_inside_country(country,data_date[1],data_date[2],data_date[0])
    # # print("mask data",data)
    avg_year=[]
    for i in data:
        # a = np.round(np.nanmean(i.flatten()),4),4
        avg_year.append(np.round(np.nanmean(i.flatten()),4))
  
    avg = np.round(np.mean(avg_year), 4)
    if index == 'pr':
        unit = "mm"
    else:
        unit = "°C"

    return jsonify(avg_year, avg, unit)

@app.route("/api/continent",methods=['GET'])
def continent():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    # country = request.headers.get("country")
    continent = "Europe"
    # print("country :",country)
    f = read_folder(dataset, index, startyear, stopyear)
    data_date = select_data_fromdate(f,startyear,stopyear,startmonth,stopmonth)
    data = mask_inside_country(continent,data_date[1],data_date[2],data_date[0])
    res = np.nanmean(data[:], axis = 0).flatten()
    resp = np.where(np.isnan(res), None, res)
    pmax_ = np.round(np.nanmax(res), 4)
    Min , Max = range_boxplot(res,index)
    
    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]   
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return jsonify(y.tolist(),x.tolist(),resp.tolist(),np.float64(Min),np.float64(Max),lon_step,lat_step,color)

if __name__ == '__main__':
    app.run(debug=True, port=5500)
