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

from lib.function import range_boxplot
from lib.boxplotfunction import filter_by_station2, filter_ERA_by_station, filterseason_by_station, filteryear_by_station,boxplotera, boxplotseason,boxplotyear,byear
# from lib.Calculate import Calculate_service
# from lib.Percent_different import Percent_service
from lib.read_folder import *
from lib.country import mask_inside_country,mask_inside_continent

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'tmean','rain5','rain','tmax','test'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/Project'

# client = pymongo.MongoClient('mongodb://localhost:27017/')
# database = "test"

mongo = PyMongo(app)
CORS(app)


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
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    sta = str(request.args.get("sta"))
    res = sta.strip('][').split(',') 
    readfile = pd.read_csv(f"C:/Users/ice/Documents/climate/data/missing-{dff}.csv")
    v = getmiss(startyear,stopyear,res,readfile)
    return jsonify(v)

#---------------------- Map Thailand station---------------------------------------
@app.route('/locat/station',methods=['GET'])
def locat():
    df_f = str(request.args.get("df_f"))
    startdate = str(request.args.get("startdate"))    # '1980-10-01'
    stopdate = str(request.args.get("stopdate"))      # '1981-02-28'

    if df_f == 'tas':
        ds = pd.read_csv("C:/Users/ice/Documents/climate/data/station_column_format/tmean_1951-2015.csv")
        color_map = 'cool_warm'
    elif df_f == 'tasmin' :
        ds = pd.read_csv("C:/Users/ice/Documents/climate/data/station_column_format/tmin_1951-2016.csv")
        color_map = 'cool_warm'
    elif df_f == 'tasmax' :
        ds = pd.read_csv("C:/Users/ice/Documents/climate/data/station_column_format/tmax_1951-2016.csv") 
        color_map = 'cool_warm'
    elif df_f == 'pre':
        ds = pd.read_csv("C:/Users/ice/Documents/climate/data/station_column_format/pr_1951-2018.csv")
        color_map = 'dry_wet'

        
    df = pd.read_csv("C:/Users/ice/Documents/climate/data/station_column_format/station_ThailandTMD.csv")
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
    dff = pd.read_csv(f'C:/Users/ice/Documents/climate/data/{df}-{showtype}.csv')
        
    # calculate value
    if showtype =='year':
        b = boxplotyear(dff,res,start_date,end_date)
    elif showtype =='season':
        b = boxplotseason(dff,res,start_date,end_date)
    elif showtype =='era':
        b = boxplotera(dff,res,start_date,end_date)

    return jsonify(b)

#-----------------------------------------------------------------------------------
# ------- LINE ANOMALY -------------------------------------------------------------
#------------------------- STATION -------------------------------------------------
@app.route('/api/line',methods=["GET"])
def anomalyplot():    
    dff = str(request.args.get("dff"))
    station = int(request.args.get("station"))
    region = pd.read_csv('C:/Users/ice/Documents/climate/data/station_Thailand_region.csv')
    re = region.loc[region['id']==station]['region'].values
    df = pd.read_csv(f'C:/Users/ice/Documents/climate/data/{dff}_station_{re[0].lower()}_Thailand.csv')

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
# ------------------- don't know why and now this function error ---------------------
def anomalyNC():
    df = Dataset("C:/Users/ice/Documents/climate/data/cru_ts4.04.1901.2019.tmp.dat.nc")
    temp = df.variables['tmp'][:]
    # lat = df.variables['lat'][:]
    # lon = df.variables['lon'][:]
    # time = df.variables['time'][:]

    # baseline 1961 -1990
    baseline_start = 1961
    baseline_end = 1991
    start_year = 1901
    end_year = 2019
    start_index = baseline_start - start_year
    end_index = baseline_end - start_year
    # num_baseline_year = baseline_end - baseline_start

    # calculate baseline
    baseline = np.nanmean(temp[start_index:end_index], axis=(1,2))
    baseline_sum = np.sum(baseline)

    baseline = baseline_sum/(baseline.shape)

    # all value
    global_average= np.nanmean(temp[:,:,:],axis=(1,2)) 
    annual_temp = np.mean(np.reshape(global_average,(119,12)), axis = 1)

    # calculate anomaly
    anomaly = annual_temp - baseline
    year = list(range(start_year,end_year+1))

    ana = {'anomaly':anomaly}
    year = {'year':year}
    return jsonify(ana,year)

@app.route('/api/anomalyNC', methods=["GET"])
def anamalymap():
    ncfile = str(request.args.get("ncfile"))
    filename = str(request.args.get("filename"))
    readfile = pd.read_csv(f'C:/Users/ice/Documents/climate/manage_nc/{filename}_{ncfile}.csv')
    df = pd.read_csv('C:/Users/ice/Documents/climate/data/index_detail.csv')
    query = df.loc[(df['dataset']==ncfile)&(df['index']==filename)]
    select = list(query[['long_name']].values[0])
    an = []
    for i in readfile['value']:
        an.append(float("%.2f"% i))
    y = []
    for i in readfile['year']:
        y.append(i)
    ano = {'anomaly':an}
    year = {'year':y}
    namefile = {'name':select}
    if filename == 'pr':
        unit = "mm"
    else:
        unit = "°C"
    return jsonify(ano,year,namefile,unit)

#----------------------- MK TEST -------------------------------------------------------
@app.route("/api/mkstation",methods=["GET"])
def mkstation():
    df = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/tmean1951-2015.csv")
    group_year = df.groupby('year').mean()
    group_year = group_year.drop(columns=['day', 'month'])
    group_year = np.round(group_year, 2)
    data = group_year['300201']
    res = mk.original_test(data)
    trend_line = np.arange(len(data)) * res.slope + res.intercept
    return trend_line


# ----------------------------------map different-----------------------------------------
@app.route("/map_range1", methods=["GET"])
def map_range1():
    
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

@app.route("/map_range1month", methods=["GET"])
def map_range1month():

    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    start = int(request.args.get("start"))
    stop = int(request.args.get("stop"))
    month = str(request.args.get("month")) # "[0,1,2,3]"
    print("month",month)
    res = month.strip('][').split(',') 
    selectmonth = []
    for i in res :
        selectmonth.append(int(i))
    print("month>>>>>>>>>>>>>",selectmonth)
    f = read_folder(dataset, index, start, stop)
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        val = ds['value'][selectmonth]
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

@app.route("/map_range2month", methods=["GET"])
def map_range2month():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    start = int(request.args.get("start"))
    stop = int(request.args.get("stop"))
    month = str(request.args.get("month")) # "[0,1,2,3]"
    res = month.strip('][').split(',') 
    selectmonth = []
    for i in res :
        selectmonth.append(int(i))

    print("month>>>>>>>>>>>>>",selectmonth)
    f = read_folder(dataset, index, start, stop)
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        val = ds['value'][selectmonth]
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

#--------------- high resolution ------------------------

@app.route('/nc_avg_hire', methods=['GET'])
def get_Avgmap_h():
    ncfile = str(request.args.get("ncfile"))
    df_f = str(request.args.get("df_f"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))

    f = read_folder_h(ncfile, df_f, startyear, stopyear)
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        if f[i][:-4].split("-")[1] == str(startyear):
            val = ds['value'][startmonth-1:12]
            val = np.mean(val, axis = 0)#.flatten()
        elif f[i][:-4].split("-")[1] == str(stopyear):
            val = ds['value'][:stopmonth]
            val = np.mean(val, axis = 0)
        else:
            val = ds['value'][0:12]
            val = np.mean(val, axis = 0)#.flatten()

        V.append(val)
        
    res = np.nanmean(V[:], axis = 0).flatten()
    resp = np.where(np.isnan(res), None, res)
    max_ = np.round(np.nanmax(res), 4)

    Min , Max = range_boxplot(res,df_f)

    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2] 
    if df_f == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return jsonify(y.tolist(),x.tolist(),resp.tolist(),np.float64(Min),np.float64(Max),np.float64(lon_step),np.float64(lat_step),color)

#--------------------------------- Low resolution---------------------------------------------------
# -----------------------------------------------per-----------------------------------------------


@app.route("/per_dif", methods=["GET"])
def per_dif():
    # start = time.time()
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

    dif = np.subtract(res1,res)
    per = ((dif/res)*100).flatten()
    per1 = np.where(np.isnan(per), None, per)
    

    Min , Max = range_boxplot(per,index)

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
    # start = time.time()
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
    # range1 = res.flatten()
    # val1 = np.where(np.isnan(range1), None, range1)

    V1 = []
    for i in range(len(f[1])):
        ds = np.load(f[1][i])
        val = ds['value'][:]
        val = np.mean(val, axis = 0)#.flatten()
        V1.append(val)
    res1 = np.nanmean(V1[:], axis = 0)#.flatten()
    # range2 = res1.flatten()
    # val2 = np.where(np.isnan(range2), None, range2)

    raw = np.subtract(res1,res).flatten()
    # per = ((dif/res)*100).flatten()
    raw1 = np.where(np.isnan(raw), None, raw)
    Min , Max = range_boxplot(raw,index)

    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'


    return jsonify(y.tolist(),x.tolist(),raw1.tolist(),np.float64(Min),np.float64(Max),lon_step,lat_step,color,)

#------------------------ map trend ------------------------------------------
#-------------------- trend function -----------------------------------------
def apply_test(row):
    res = mk.original_test(row.to_numpy(), 0.05)[0]
    if res == 'increasing':
        return 1
    elif res == 'no trend':
        return 0
    return -1
def get_Avgmaptrend(dataset, index, startyear, stopyear, startmonth, stopmonth):
    f = read_folder(dataset, index, startyear, stopyear)
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

    # print("V shape >>>>> ",len(V))
    # V1 = np.asarray(V)
    # print("V1 >>>>>>>> ",V1.shape)
    # dt = pd.DataFrame(V1.T)
    # dt = dt.fillna(1E20)
    # trend = dt.apply( lambda row: apply_test(row),  axis=1 )
    # print("TREND shape >>>>> ",trend)
    t0 = datetime.now()
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
    t1 = datetime.now()
    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]

    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'
    # l = trend.tolist()
    # print(type(l))
    print("time >>>>>>>> ",t1 - t0)
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

#----------------------------map-------------------------------------
@app.route('/nc_avg', methods=['GET'])
def get_Avgmap():
    dataset = str(request.args.get("ncfile"))
    index = str(request.args.get("df_f"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    # start = time.time()
    f = read_folder(dataset, index, startyear, stopyear)
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

        V.append(val)
    res = np.nanmean(V[:], axis = 0).flatten() #เฉลี่ยแต่ละจุดของทุกปี shape (จำนวนจุด)    
    resp = np.where(np.isnan(res), None, res)
    max_ = np.round(np.nanmax(res), 4)

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

# --------------------avg global chart-----------------------
@app.route("/api/global_avg", methods=['GET'])
def avg_global_year():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    path = f'C:/Users/ice/Documents/climate/data/{dataset}.avg_global.csv'
    df = pd.read_csv(path)
    if dataset == 'cru_ts':
        start_year = 1901
    else:
        start_year = 1979
    start_index = startyear - start_year
    end_index = stopyear - start_year
    result = df[index][start_index:end_index+1].tolist()
    avg = np.round(np.mean(result), 4)
    if index == 'pr':
        unit = "mm"
    else:
        unit = "°C"
    return jsonify(result, avg, unit)

#----------------------- Get detials ----------------------------------
@app.route("/api/dataset", methods=["GET"])
def get_dataset():
    ds = pd.read_csv("C:/Users/ice/Documents/climate/data/dataset_name.csv")
    res = []
    for i in range(len(ds['id'])):
        res.append({'id': ds['id'][i] , 'name': ds['name'][i] })

    return jsonify(res)

@app.route("/api/detail", methods=['GET'])
def detail():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    df = pd.read_csv('C:/Users/ice/Documents/climate/data/index_detail.csv')
    query = df.loc[(df['dataset']==dataset)&(df['index']==index)]
    select = query[['long_name','description','unit','year','color_map']].to_json(orient='records')
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

#----------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port= 5500)
