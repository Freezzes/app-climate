from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS 
import pandas as pd
import numpy as np
import time
import json
from matplotlib import cm
import matplotlib.dates as mdates
import datetime
from itertools import groupby
from netCDF4 import Dataset
import pymannkendall as mk
from datetime import datetime
import os
from pathlib import Path

from lib.function import *
from lib.boxplotfunction import filter_by_station2, filter_ERA_by_station, filterseason_by_station, filteryear_by_station,boxplotera, boxplotseason,boxplotyear,byear
from lib.read_folder import *
from lib.country import mask_inside_country_npz

app = Flask(__name__)

CORS(app)
# curDir = Path("C:/Users/ice/app-climate/server")
curDir = Path("")
dataDir = curDir / "climate"

@app.route('/check_data', methods=['GET'])
def check_data():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    c = check_range(dataset, index, startyear, stopyear)
    return c
#----------- Missing Value ---------------------------------------------------------------------------
def getmiss(startyear,stopyear,station,dff):
    mask = (dff['y'] >= startyear) & (dff['y'] <= stopyear)
    dat = dff.loc[mask].reset_index(drop=True) 
    listmis = []
    for i in range(len(dat)):
        d = {}
        d['station'] = str(dat['station'][i])
        d['x'] = int(dat['x'][i])
        d['y'] = int(dat['y'][i])

        if dat['value'][i] == str('-'):
            d['value'] = '-'
        else :
            d['value'] =int(dat['value'][i])
        listmis.append(d)  
    return listmis
    
@app.route('/api/selectmissing', methods=['GET'])
def selectmissing():
    dff = str(request.args.get("dff"))
    readfile = pd.read_csv(dataDir/f'data/missing-{dff}.csv')
    station = list(set(readfile['station']))
    startyear = readfile['y'][0]
    stopyear = readfile['y'][readfile.index[-1]]
    v = getmiss(startyear,stopyear,station,readfile)
    return jsonify(v)

#---------------------- Map Thailand station---------------------------------------
@app.route('/locat/station',methods=['GET'])
def locat():
    df_f = str(request.args.get("df_f"))
    startdate = str(request.args.get("startdate"))    # '1980-10-01'
    stopdate = str(request.args.get("stopdate"))      # '1981-02-28'

    if df_f == 'tas':
        ds = pd.read_csv(dataDir/'data/station_column_format/tmean_1951-2015.csv')
        color_map = 'cool_warm'
    elif df_f == 'tasmin' :
        ds = pd.read_csv(dataDir/'data/station_column_format/tmin_1951-2016.csv')
        color_map = 'cool_warm'
    elif df_f == 'tasmax' :
        ds = pd.read_csv(dataDir/'data/station_column_format/tmax_1951-2016.csv') 
        color_map = 'cool_warm'
    elif df_f == 'pr':
        ds = pd.read_csv(dataDir/'data/station_column_format/pr_1951-2018.csv')
        color_map = 'dry_wet'

        
    df = pd.read_csv(dataDir/'data/station_column_format/station_ThailandTMD.csv')
    df['Avg_val'] = "" 
    ds['date'] = pd.to_datetime(ds['date'] , format='%Y-%m-%d')
    col = ds.columns[3:-1]
    for i in range(len(col)):
        df['Avg_val'][i] = float("%.2f"% ds.loc[(ds['date'] >= startdate) & (ds['date'] <= stopdate), col[i]].mean(skipna = True))
    select = df[['id','name','latitude','longitude','Avg_val']].to_json(orient='records')
    select = json.loads(select)
    return jsonify(select,color_map)

#------------------------------------------------------------------------------------------------------
#---------- Boxplot Station----------------------------------------------------------------------------
@app.route('/api/boxplotvalue', methods=["GET"])
def selectboxplot2():
    df = str(request.args.get("df"))
    showtype = str(request.args.get("showtype"))
    station = str(request.args.get("station"))
    start_date = str(request.args.get("start_date"))
    end_date = str(request.args.get("end_date"))
    res = station.strip('][').split(',') 
    dff = pd.read_csv(dataDir/f'data/{df}-{showtype}.csv')
        
    # calculate value
    if showtype =='year':
        b = boxplotyear(dff,res,start_date,end_date)
    elif showtype =='season':
        b = boxplotseason(dff,res,start_date,end_date)
    elif showtype =='era':
        b = boxplotera(dff,res,start_date,end_date)

    return jsonify(b)

# ------- LINE ANOMALY -------------------------------------------------------------
#------------------------- STATION -------------------------------------------------
@app.route('/api/line',methods=["GET"])
def anomalyplot():    
    dff = str(request.args.get("dff"))
    station = int(request.args.get("station"))
    region = pd.read_csv(dataDir/'data/station_Thailand_region.csv')
    re = region.loc[region['id']==station]['region'].values
    df = pd.read_csv(dataDir/f'data/{dff}_station_{re[0].lower()}_Thailand.csv')

    mask = (df['year'] >= 1961) & (df['year'] <= 1990)
    baseline = df.loc[mask]
    bs = baseline.drop(columns=['date','day', 'month','year'])
    baseline_val = float("%.2f"% (np.nanmean(bs[:])))
    group_year = df.groupby('year').mean()
    group_year = group_year.drop(columns=['day', 'month'])
    group_year['mean'] = group_year.mean(axis=1)
    index = 'mean'
    anomaly = (group_year[index] - baseline_val)
    a = anomaly.values.round(2)
    ana = {'anomaly':list(a)}
    year = {'year':list(anomaly.index)}

    return jsonify(ana,year,list(re))

#-------------------------- NC anomaly ------------------------------------------------------
@app.route('/api/anomalyNC', methods=["GET"])
def anamalymap():
    ncfile = str(request.args.get("ncfile"))
    filename = str(request.args.get("filename"))
    readfile = pd.read_csv(dataDir/f'manage_nc/{filename}_{ncfile}.csv')
    df = pd.read_csv(dataDir/'data/index_detail.csv')
    query = df.loc[(df['dataset']==ncfile)&(df['index']==filename)]
    select = list(query[['long_name']].values[0])
    an = []
    for i in readfile['value']:
        an.append(float("%.2f"% i))
    y = []
    for i in readfile['year']:
        y.append(i)

    l = []
    for i in an:
        if i <0:
            i = i*(-1)
            l.append(i)
        else:
            l.append(i)
    scope = max(l)
    data = {'anomaly':an,'year':y,'scope':scope}
    return jsonify(data)

#--------------------- anomaly rcp ------------------------------------------------------
@app.route('/api/anomalyNC_rcp', methods=["GET"])
def anomaly_global_rcp():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    type_ = str(request.args.get("type_"))
    rcp = str(request.args.get('rcp'))
    readfile = pd.read_csv(dataDir/f'manage_nc/anomaly_indices_{type_}/{dataset}_{rcp}_{index}_anomaly.csv')
    df = pd.read_csv(dataDir/'data/detail_rcp.csv')
    query = df.loc[(df['type_']==type_)&(df['index']==index)]
    select = list(query[['long_name']].values[0])
    
    an = []
    for i in readfile['value']:
        if str(i) == str('nan'):
            an.append("-")
        else :
            an.append(float("%.2f"% i))
    y = []
    for i in readfile['year']:
        y.append(i)
    l = []
    for i in an:
        if i <0:
            i = i*(-1)
            l.append(i)
        else:
            l.append(i)
    scope = max(l)
    data = {'anomaly':an,'year':y,'scope':scope}
    return jsonify(data)

# ----------------------- Anomaly select country ---------------------------------------
@app.route('/api/anomalycountry', methods=['GET'])
def country_anomaly():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startmonth = 1 
    stopmonth = 12 
    country = request.headers.get("country")
    if dataset == 'cru-ts':
        startyear = 1901 
        stopyear = 2019 
    elif dataset == 'ec-earth3':
        startyear = 1979 
        stopyear = 2017 
    else:
        startyear = 1979
        stopyear = 2014 
    df = pd.read_csv(dataDir/'data/index_detail.csv')
    
    query = df.loc[(df['dataset']==dataset)&(df['index']==index)]
    select = list(query[['long_name']].values[0])

    f = read_folder_h(dataset, index, startyear, stopyear)
    data_date = select_data_fromdate(f,startyear,stopyear,startmonth,stopmonth)
    data = mask_inside_country_npz(dataset,country,data_date[1],data_date[2],data_date[0])
    avg_year=[]
    for i in data:
        avg_year.append(np.round(np.nanmean(i.flatten()),4))
    baseline_start = 1981
    baseline_end = 2011
    start_index = baseline_start - startyear
    end_index = baseline_end - startyear
    baseline_sum = np.mean(avg_year[start_index:end_index])
    anom = []
    for i in avg_year:
        anom.append(round((i-baseline_sum),2))

    year = list(range(startyear,stopyear+1))
    l = []
    for i in anom:
        if i <0:
            i = i*(-1)
            l.append(i)
        else:
            l.append(i)
    scope = max(l)
    data = {'anomaly':anom,'year':year,'scope':scope}
    return jsonify(data)
#--------------------- anomaly country rcp ---------------------------------------------
@app.route('/api/anomalycountry_rcp', methods=['GET'])
def country_anomaly_rcp():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    type_ = str(request.args.get("type_"))
    rcp = str(request.args.get('rcp'))
    startmonth = 1 
    stopmonth = 12 
    startyear = 1970
    stopyear = 2099
    country = request.headers.get("country")

    df = pd.read_csv(dataDir/'data/detail_rcp.csv')
    query = df.loc[(df['type_']==type_)&(df['index']==index)]
    select = list(query[['long_name']].values[0])

    f = read_folder_rcp(dataset, index, type_, rcp, startyear, stopyear, 'h')
    if type_ == 'y':
        data_date = select_data_fromdate_year(f)
        print("shape",data_date[0][0])
    elif type_ == 'm':
        data_date = select_data_fromdate(f, startyear, stopyear, startmonth, stopmonth)
    data = mask_inside_country_npz(dataset+'_'+ rcp, country, data_date[1], data_date[2], data_date[0])

    avg_year=[]
    for i in data:
        avg_year.append(np.round(np.nanmean(i.flatten()),4))
    baseline_start = 1981
    baseline_end = 2011
    start_index = baseline_start - startyear
    end_index = baseline_end - startyear
    baseline_sum = np.mean(avg_year[start_index:end_index])
    print(baseline_sum)
    anom = []
    for i in avg_year:
        if str(i) == str('nan'):
            anom.append("-")
        else :
            anom.append(round((i-baseline_sum),2))

    year = list(range(startyear,stopyear+1))
    l = []
    for i in anom:
        if i <0:
            i = i*(-1)
            l.append(i)
        else:
            l.append(i)
    scope = max(l)
    data = {'anomaly':anom,'year':year,'scope':scope}
    return jsonify(data)

# ----------------------------------map different-----------------------------------------
@app.route("/map_range1", methods=["GET"])
def map_range1():
    start = time.time()
    dataset = str(request.args.get("dataset"))
    type_ = str(request.args.get("type_"))
    rcp = str(request.args.get('rcp'))
    index = str(request.args.get("index"))
    start = int(request.args.get("start"))
    stop = int(request.args.get("stop"))
    if rcp == 'None' and type_ == 'None':
        f = read_folder(dataset, index, start, stop,'l')
        V = map_month(f)
    else:
        f = read_folder_rcp(dataset, index, type_,rcp,start, stop,'l')
        if type_ == 'y':
            V = select_data_fromdate_year(f)
        elif type_ == 'm':
            V = map_month(f)
   
    res = np.nanmean(V[0][:], axis=0)  # .flatten()
    range1 = res.flatten()
    val1 = np.where(np.isnan(range1), None, range1)
    Min, Max = np.float64(range_boxplot(range1))
    lat = V[1]
    lon = V[2]
    x = np.repeat(lat, lon.shape[0])
    y = np.tile(lon, lat.shape[0])
    lat_step = lat[-1] - lat[-2]
    lon_step = lon[-1] - lon[-2]

    return jsonify(y.tolist(), x.tolist(), val1.tolist(), Min, Max, lon_step, lat_step)

@app.route("/map_range2", methods=["GET"])
def map_range2():
    start = time.time()
    dataset = str(request.args.get("dataset"))
    type_ = str(request.args.get("type_"))
    rcp = str(request.args.get('rcp'))
    index = str(request.args.get("index"))
    start = int(request.args.get("start"))
    stop = int(request.args.get("stop"))
    if rcp == 'None' and type_ == 'None':
        f = read_folder(dataset, index, start, stop,'l')
        V = map_month(f)
    else:
        f = read_folder_rcp(dataset, index, type_,rcp,start, stop,'l')
        if type_ == 'y':
            V = select_data_fromdate_year(f)
        elif type_ == 'm':
            V = map_month(f)
   
    res = np.nanmean(V[0][:], axis=0)  # .flatten()
    range1 = res.flatten()
    val1 = np.where(np.isnan(range1), None, range1)
    Min, Max = np.float64(range_boxplot(range1))
    lat = V[1]
    lon = V[2]
    x = np.repeat(lat, lon.shape[0])
    y = np.tile(lon, lat.shape[0])
    lat_step = lat[-1] - lat[-2]
    lon_step = lon[-1] - lon[-2]
    return jsonify(y.tolist(), x.tolist(), val1.tolist(), Min, Max, lon_step, lat_step)

@app.route("/map_range1month", methods=["GET"])
def map_range1month():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    type_ = str(request.args.get("type_"))
    rcp = str(request.args.get('rcp'))
    start = int(request.args.get("start"))
    stop = int(request.args.get("stop"))
    month = str(request.args.get("month")) # "[0,1,2,3]"
    res = month.strip('][').split(',') 
    selectmonth = []
    for i in res :
        selectmonth.append(int(i))

    if rcp == 'None' and type_ == 'None':
        f = read_folder(dataset, index, start, stop,'l')
        V = []
        for i in range(len(f)):
            ds = np.load(f[i])
            val = ds['value'][selectmonth]
            val = np.mean(val, axis = 0)#.flatten()
            V.append(val)
    else:
        f = read_folder_rcp(dataset, index, type_,rcp,start, stop,'l')
        if type_ == 'y':
            V = select_data_fromdate_year(f)
        elif type_ == 'm':
            V = []
            for i in range(len(f)):
                ds = np.load(f[i])
                val = ds['value'][selectmonth]
                val = np.mean(val, axis = 0)#.flatten()
                V.append(val)

    res = np.nanmean(V[:], axis = 0)#.flatten()
    range1 = res.flatten()
    val1 = np.where(np.isnan(range1), None, range1)

    Min , Max = np.float64(range_boxplot(range1))

    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]  
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return jsonify(y.tolist(),x.tolist(),val1.tolist(),Min,Max,lon_step,lat_step,color)

@app.route("/map_range2month", methods=["GET"])
def map_range2month():
    dataset = str(request.args.get("dataset"))
    type_ = str(request.args.get("type_"))
    rcp = str(request.args.get('rcp'))
    index = str(request.args.get("index"))
    start = int(request.args.get("start"))
    stop = int(request.args.get("stop"))
    month = str(request.args.get("month")) # "[0,1,2,3]"
    print("month",month)
    res = month.strip('][').split(',') 
    selectmonth = []
    for i in res :
        selectmonth.append(int(i))

    if rcp == 'None' and type_ == 'None':
        f = read_folder(dataset, index, start, stop,'l')
        V = map_select_month(f,selectmonth)
    else:
        f = read_folder_rcp(dataset, index, type_,rcp,start, stop,'l')
        if type_ == 'y':
            V = select_data_fromdate_year(f)
        elif type_ == 'm':
            V = map_select_month(f,selectmonth)
   
    res = np.nanmean(V[0][:], axis=0)  # .flatten()
    range1 = res.flatten()
    val1 = np.where(np.isnan(range1), None, range1)

    Min, Max = np.float64(range_boxplot(range1))
    lat = V[1]
    lon = V[2]
    x = np.repeat(lat, lon.shape[0])
    y = np.tile(lon, lat.shape[0])
    lat_step = lat[-1] - lat[-2]
    lon_step = lon[-1] - lon[-2]
    return jsonify(y.tolist(), x.tolist(), val1.tolist(), Min, Max, lon_step, lat_step)

# -----------------------------------------------per-----------------------------------------------

@app.route("/per_dif", methods=["GET"])
def per_dif():
    dataset = str(request.args.get("ncfile"))
    index = str(request.args.get("df_f"))
    type_ = str(request.args.get("type_"))
    rcp = str(request.args.get('rcp'))
    start1 = int(request.args.get("start1"))
    stop1 = int(request.args.get("stop1"))
    start2 = int(request.args.get("start2"))
    stop2 = int(request.args.get("stop2"))

    if rcp == 'None' and type_ == 'None':
        f = read_folder_dif(dataset, index, start1, stop1, start2, stop2)
        V = map_month(f[0])
        V1 = map_month(f[1])
    else:
        f = read_folder_difrcp(dataset, index, type_, rcp, start1, stop1, start2, stop2)
        if type_ == 'y':
            V = select_data_fromdate_year(f[0])
            V1 = select_data_fromdate_year(f[1])
        elif type_ == 'm':
            V = map_month(f[0])
            V1 = map_month(f[1])
   
    res = np.nanmean(V[0][:], axis=0)  # .flatten()
    res1 = np.nanmean(V1[0][:], axis=0)  # .flatten()
    dif = np.subtract(res1, res)
    per = ((dif/res)*100).flatten()
    per1 = np.where(np.isnan(per), None, per)
    Min, Max = range_boxplot(per)
    lat = V[1]
    lon = V[2]
    x = np.repeat(lat, lon.shape[0])
    y = np.tile(lon, lat.shape[0])
    lat_step = lat[-1] - lat[-2]
    lon_step = lon[-1] - lon[-2]

    return jsonify(y.tolist(), x.tolist(), per1.tolist(), Min, Max, lon_step, lat_step)

@app.route("/raw_dif", methods=["GET"])
def raw_dif():
    start = time.time()
    dataset = str(request.args.get("ncfile"))
    index = str(request.args.get("df_f"))
    type_ = str(request.args.get("type_"))
    rcp = str(request.args.get('rcp'))
    start1 = int(request.args.get("start1"))
    stop1 = int(request.args.get("stop1"))
    start2 = int(request.args.get("start2"))
    stop2 = int(request.args.get("stop2"))
    
    if rcp == 'None' and type_ == 'None':
        f = read_folder_dif(dataset, index, start1, stop1, start2, stop2)
        V = map_month(f[0])
        V1 = map_month(f[1])
    else:
        f = read_folder_difrcp(dataset, index, type_, rcp, start1, stop1, start2, stop2)
        if type_ == 'y':
            V = select_data_fromdate_year(f[0])
            V1 = select_data_fromdate_year(f[1])
        elif type_ == 'm':
            V = map_month(f[0])
            V1 = map_month(f[1])
   
    res = np.nanmean(V[0][:], axis=0)  # .flatten()
    res1 = np.nanmean(V1[0][:], axis=0)  # .flatten()

    raw = np.subtract(res1, res).flatten()
    raw1 = np.where(np.isnan(raw), None, raw)

    Min, Max = np.float64(range_boxplot(raw))

    lat = V[1]
    lon = V[2]
    x = np.repeat(lat, lon.shape[0])
    y = np.tile(lon, lat.shape[0])
    lat_step = lat[-1] - lat[-2]
    lon_step = lon[-1] - lon[-2]


    return jsonify(y.tolist(), x.tolist(), raw1.tolist(), Min, Max, lon_step, lat_step)

#------------------------ map trend ------------------------------------------
#-------------------- trend function -----------------------------------------
def get_Avgmaptrend(dataset, index, startyear, stopyear, startmonth, stopmonth):
    f = read_folder(dataset, index, startyear, stopyear,'l')
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        if f[i][:-4].split("-")[1] == str(startyear): 
            val = ds['value'][startmonth-1:12] 
            val = np.mean(val, axis = 0)
        elif f[i][:-4].split("-")[1] == str(stopyear):
            val = ds['value'][:stopmonth]
            val = np.mean(val, axis = 0)
        else:
            val = ds['value'][0:12]
            val = np.mean(val, axis = 0)
        V.append(val.flatten())

    trend = []
    for j in range(len(V[0])):
        lis = []
        for i in range(len(V)):
            if str(V[i][j]) == str(np.nan):
                V[i][j] = 1E20
            lis.append(V[i][j])
        res = mk.original_test(lis,0.05)
        if res[0] == 'increasing':
            trend.append(1)
        elif res[0] == 'no trend':
            trend.append(0)
        else :
            trend.append(-1)
    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]

    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return y.tolist(),x.tolist(),trend,-1,1,lon_step,lat_step,color

@app.route('/nc_avgtrend', methods=['GET'])
def selectNCtrend():
    ncfile = str(request.args.get("ncfile"))
    df_f = str(request.args.get("df_f"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    a = get_Avgmaptrend(ncfile, df_f, startyear, stopyear, startmonth, stopmonth)
    return jsonify(a)

#------------------------ rcp trend ---------------------------------
def get_rcpmaptrend_year(dataset, index, type_, rcp, startyear, stopyear):
    f = read_folder_rcp(dataset, index, type_, rcp, startyear, stopyear, 'h')
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        val = ds['value'][:]
        V.append(val.flatten())

    trend = []
    for j in range(len(V[0])):
        lis = []
        for i in range(len(V)):
            if str(V[i][j]) == str(np.nan):
                V[i][j] = 1E20
            lis.append(V[i][j])
        res = mk.original_test(lis,0.05)
        if res[0] == 'increasing':
            trend.append(1)
        elif res[0] == 'no trend':
            trend.append(0)
        else :
            trend.append(-1)
    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]

    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return y.tolist(),x.tolist(),trend,-1,1,lon_step,lat_step,color

def get_rcpmaptrend_month(dataset, index, type_, rcp, startyear, stopyear, startmonth, stopmonth):
    
    f = read_folder_rcp(dataset, index, type_, rcp, startyear, stopyear, 'h')
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        if f[i][:-4].split("-")[1] == str(startyear): #เช็คชื่อไฟล์ว่าปีตรงกับพี่เริ่ม 
            val = ds['value'][startmonth-1:12] #เอาค่าตั้งแต่ startmonth ถึง เดือน12
            val = np.mean(val, axis = 0) #เฉลี่ยทั้งหมด shape (lat,lon)
        elif f[i][:-4].split("-")[1] == str(stopyear):
            val = ds['value'][:stopmonth]
            val = np.mean(val, axis = 0)
        else:
            val = ds['value'][0:12]
            val = np.mean(val, axis = 0)#.flatten()
        V.append(val.flatten())

    trend = []
    for j in range(len(V[0])):
        lis = []
        for i in range(len(V)):
            if str(V[i][j]) == str(np.nan):
                V[i][j] = 1E20
            lis.append(V[i][j])
        res = mk.original_test(lis,0.05)
        if res[0] == 'increasing':
            trend.append(1)
        elif res[0] == 'no trend':
            trend.append(0)
        else :
            trend.append(-1)
    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]

    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return y.tolist(),x.tolist(),trend,-1,1,lon_step,lat_step,color

@app.route('/rcp_avgtrend', methods=['GET'])
def selectrcp_trend():
    ncfile = str(request.args.get("ncfile"))
    index = str(request.args.get("index"))
    type_ = str(request.args.get("type_"))
    rcp = str(request.args.get("rcp"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    if type_ == 'y':
        a = get_rcpmaptrend_year(ncfile, index, type_, rcp, startyear, stopyear)    
    else :
        a = get_rcpmaptrend_month(ncfile, index, type_, rcp, startyear, stopyear, startmonth, stopmonth)
    return jsonify(a)



#----------------------------map-------------------------------------
@app.route('/nc_avg', methods=['GET'])
def get_Avgmap():
    dataset = str(request.args.get("ncfile"))
    index = str(request.args.get("df_f"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    f_l = read_folder(dataset, index, startyear, stopyear,'l')
    f_h = read_folder(dataset, index, startyear, stopyear,'h')
    get_data_l = select_data_fromdate(f_l, startyear, stopyear, startmonth, stopmonth)    
    get_data_h = select_data_fromdate(f_h, startyear, stopyear, startmonth, stopmonth)    

    data_l = data_to_map(get_data_l)
    data_h = data_to_map(get_data_h)
    res = {'low' : data_l, 'high' : data_h}
  
    end = time.time()
    return jsonify(res)

@app.route('/map_rcp', methods=['GET'])
def get_Avgmap_rcp():
    dataset = str(request.args.get("dataset"))
    type_ = str(request.args.get("type_"))
    rcp = str(request.args.get('rcp'))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    f_l = read_folder_rcp(dataset, index, type_,rcp,startyear, stopyear,'l')
    f_h = read_folder_rcp(dataset, index, type_,rcp,startyear, stopyear,'h')
    if type_ == 'y':
        get_data_l = select_data_fromdate_year(f_l)
        get_data_h = select_data_fromdate_year(f_h)
    elif type_ == 'm':
        get_data_l = select_data_fromdate(f_l, startyear, stopyear, startmonth, stopmonth)
        get_data_h = select_data_fromdate(f_h, startyear, stopyear, startmonth, stopmonth)

    data_l = data_to_map(get_data_l)
    data_h = data_to_map(get_data_h)

    res = {'low' : data_l, 'high' : data_h}
    return jsonify(res)

# --------------------avg global chart-----------------------
@app.route("/api/global_avg", methods=['GET'])
def avg_global_year():
    start = time.time()
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))

    f = read_folder_h(dataset, index, startyear, stopyear)
    data_date = select_data_fromdate(f,startyear,stopyear,startmonth,stopmonth)
    avg_year = []
    for i in data_date[0]:
        # a = np.round(np.nanmean(i.flatten()),4),4
        avg_year.append(np.round(np.float64(np.nanmean(i.flatten())), 4))

    year = list(range(startyear,stopyear+1))
    # print(year)
    data = {'data':avg_year,'year':year}
    return jsonify(data)

@app.route("/api/global_avg_rcp", methods=['GET'])
def avg_global_year_rcp():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    type_ = str(request.args.get("type_"))
    rcp = str(request.args.get('rcp'))
    startyear = int(request.args.get("startyear"))
    startmonth = int(request.args.get("startmonth"))
    stopyear = int(request.args.get("stopyear"))
    stopmonth = int(request.args.get("stopmonth"))
    f = read_folder_rcp(dataset, index, type_,rcp,startyear, stopyear,'h')
    if type_ == 'y':
        get_data = select_data_fromdate_year(f)
    elif type_ == 'm':
        get_data = select_data_fromdate(f, startyear, stopyear, startmonth, stopmonth)
    avg_year = []
    for i in get_data[0]:
        avg_year.append(np.round(np.float64(np.nanmean(i.flatten())), 4))

    year = list(range(startyear,stopyear+1))
    # print(year)
    data = {'data':avg_year,'year':year}

    return jsonify(data)

@app.route("/api/country_avg",methods=['GET'])
def country_avg():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    country = request.headers.get("country")
    # country = 'Thailand'
    f = read_folder_h(dataset, index, startyear, stopyear)
    data_date = select_data_fromdate(f,startyear,stopyear,startmonth,stopmonth)
    data = mask_inside_country_npz(dataset,country,data_date[1],data_date[2],data_date[0])
    avg_year=[]
    for i in data:
        avg_year.append(np.round(np.nanmean(i.flatten()),4))
  
    year = list(range(startyear,stopyear+1))
    # print(year)
    data = {'data':avg_year,'year':year}

    return jsonify(data)

@app.route("/api/country_avg_rcp", methods=['GET'])
def country_avg_rcp():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    type_ = str(request.args.get("type_"))
    rcp = str(request.args.get('rcp'))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    country = request.headers.get("country")
    f = read_folder_rcp(dataset, index, type_, rcp, startyear, stopyear, 'h')
    if type_ == 'y':
        data_date = select_data_fromdate_year(f)
    elif type_ == 'm':
        data_date = select_data_fromdate(f, startyear, stopyear, startmonth, stopmonth)
    data = mask_inside_country_npz(dataset+'_'+ rcp, country, data_date[1], data_date[2], data_date[0])
    avg_year = []
    for i in data:
        avg_year.append(np.round(np.nanmean(i.flatten()), 4))
    year = list(range(startyear,stopyear+1))
    # print(year)
    data = {'data':avg_year,'year':year}

    return jsonify(data)

#----------------------- Get detials ----------------------------------
@app.route("/api/dataset", methods=["GET"])
def get_dataset():
    ds = pd.read_csv(dataDir/"data/dataset_name.csv")
    res = []
    for i in range(len(ds['id'])):
        res.append({'id': ds['id'][i] , 'name': ds['name'][i] })

    return jsonify(res)

@app.route("/api/index", methods=["GET"])
def get_index():
    dataset = str(request.args.get("dataset"))
    print("dataset",dataset)
    ds = pd.read_csv(dataDir/'data/index_detail.csv')
    a = ds.loc[ds['dataset'] == dataset]
    select = a[['index', 'name']].to_json(orient='records',force_ascii=0)
    select = json.loads(select)
    return jsonify(select)

@app.route("/api/detail", methods=['GET'])
def detail():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    df = pd.read_csv(dataDir/'data/index_detail.csv')
    query = df.loc[(df['dataset']==dataset)&(df['index']==index)]
    select = query[['long_name','description','unit','year','color_map']].to_json(orient='records')
    select = json.loads(select)
    return select[0]

@app.route("/api/dataset_rcp", methods=["GET"])
def get_dataset_rcp():
    ds = pd.read_csv(dataDir/'data/dataset_rcp.csv')
    res = []
    for i in range(len(ds['id'])):
        res.append({'id': ds['id'][i], 'name': ds['name'][i]})
    return jsonify(res)

@app.route("/api/index_rcp", methods=["GET"])
def get_index_rcp():
    type_ = str(request.args.get("type_"))
    ds = pd.read_csv(dataDir/'data/detail_rcp.csv')
    a = ds.loc[ds['type_'] == type_]
    select = a[['index', 'name']].to_json(orient='records',force_ascii=0)
    select = json.loads(select)
    return jsonify(select)

@app.route("/api/detail_rcp", methods=['GET'])
def detail_rcp():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    type_ = str(request.args.get('type_'))
    df = pd.read_csv(dataDir/'data/detail_rcp.csv')
    query = df.loc[(df['type_'] == type_) & (df['index'] == index)]
    select = query[['long_name', 'description', 'unit', 'year',
                    'color_map']].to_json(orient='records')
    select = json.loads(select)
    
    return select[0]

@app.route("/", methods=['GET'])
def hello():
    return "HELLO WORLD"
#----------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port= 5000)
