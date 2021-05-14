from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import time
import json
import netCDF4
from netCDF4 import Dataset
import datetime
from datetime import datetime
import os

from lib.function import *
from lib.read_folder import *

app = Flask(__name__)
CORS(app)

@app.route("/api/dataset", methods=["GET"])
def get_dataset():
    ds = pd.read_csv(r'C:/Mew/Project/dataset_name.csv')
    res = []
    for i in range(len(ds['id'])):
        res.append({'id': ds['id'][i], 'name': ds['name'][i]})
    return jsonify(res)

@app.route("/api/dataset_rcp", methods=["GET"])
def get_dataset_rcp():
    ds = pd.read_csv(r'C:/Mew/Project/dataset_rcp.csv')
    res = []
    for i in range(len(ds['id'])):
        res.append({'id': ds['id'][i], 'name': ds['name'][i]})
    return jsonify(res)

@app.route("/api/index", methods=["GET"])
def get_index():
    dataset = str(request.args.get("dataset"))
    ds = pd.read_csv(r'C:/Mew/Project/index_detail.csv')
    a = ds.loc[ds['dataset'] == dataset]
    select = a[['index', 'name']].to_json(orient='records',force_ascii=0)
    select = json.loads(select)
    return jsonify(select)

@app.route("/api/index_rcp", methods=["GET"])
def get_index_rcp():
    type_ = str(request.args.get("type_"))
    print("type",type_)
    ds = pd.read_csv(r'C:/Mew/Project/detail_rcp.csv')
    a = ds.loc[ds['type_'] == type_]
    select = a[['index', 'name']].to_json(orient='records',force_ascii=0)
    select = json.loads(select)
    return jsonify(select)
# ----------------------------------detail-----------------------------------------
@app.route("/api/detail", methods=['GET'])
def detail():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    type_ = str(request.args.get('type_'))
    df = pd.read_csv('C:/Mew/Project/index_detail.csv')
    if type_ != 'None':
        query = df.loc[(df['dataset'] == type_) & (df['index'] == index)]
    else:
        query = df.loc[(df['dataset'] == dataset) & (df['index'] == index)]
    # res = jsonify(query['long name'][0],query['description'][0],query['unit'][0],query['year'][0])
    # color = jsonify(query['color_map'][0])
    select = query[['long_name', 'description', 'unit', 'year',
                    'color_map', 'dataset']].to_json(orient='records')
    select = json.loads(select)
    print(select)
    return select[0]

@app.route("/api/detail_rcp", methods=['GET'])
def detail_rcp():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    type_ = str(request.args.get('type_'))
    df = pd.read_csv('C:/Mew/Project/detail_rcp.csv')
    query = df.loc[(df['type_'] == type_) & (df['index'] == index)]
    select = query[['long_name', 'description', 'unit', 'year',
                    'color_map']].to_json(orient='records')
    print(select)
    select = json.loads(select)
    
    return select[0]

# ----------------------------------------dif-----------------------------------------------
@app.route("/per_dif", methods=["GET"])
def per_dif():
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

# ------------------------------Low Re-----------------------------------------------------------------
@app.route('/check_data', methods=['GET'])
def check_data():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    c = check_range(dataset, index, startyear, stopyear)
    return c

@app.route('/nc_avg', methods=['GET'])
def get_Avgmap():
    start = time.time()
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
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
    start = time.time()
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
    print("33333333333",get_data_l[0][0].shape)
    data_l = data_to_map(get_data_l)
    data_h = data_to_map(get_data_h)

    res = {'low' : data_l, 'high' : data_h}
    end = time.time()
    return jsonify(res)
# --------------------------------station---------------------------------------

@app.route('/locat/station', methods=['GET'])
def locat():
    df_f = str(request.args.get("df_f"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    start = time.time()
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
    
    end = time.time()
    print('readfile',end-start)

    

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

# --------------------avg global chart----------------------
@app.route("/api/global_avg", methods=['GET'])
def avg_global_year():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    startmonth = int(request.args.get("startmonth"))
    stopyear = int(request.args.get("stopyear"))
    stopmonth = int(request.args.get("stopmonth"))
    # year_list = range(int(startyear), int(stopyear)+1)
    f = read_folder_h(dataset, index, startyear, stopyear)
    data_date = select_data_fromdate(f, startyear, stopyear, startmonth, stopmonth)
    print(data_date[0])
    avg_year = []
    for i in data_date[0]:
        # a = np.round(np.nanmean(i.flatten()),4),4
        avg_year.append(np.round(np.float64(np.nanmean(i.flatten())), 4))

    print("avg_year",avg_year[0])
    avg = np.round(np.mean(avg_year), 4)
    print("avg",avg)
    if index == 'pr':
        unit = "mm"
    else:
        unit = "°C"

    return jsonify(avg_year,np.round(np.float64(avg),4),unit)

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

    avg = np.round(np.mean(avg_year), 4)
    print("avg",avg)
    if index == 'pr':
        unit = "mm"
    else:
        unit = "°C"

    return jsonify(avg_year,np.round(np.float64(avg),4),unit)

@app.route("/api/country_avg", methods=['GET'])
def country_avg():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    country = request.headers.get("country")
    # country = "Thailand"
    f = read_folder_h(dataset, index, startyear, stopyear)
    data_date = select_data_fromdate(f, startyear, stopyear, startmonth, stopmonth)
    data = mask_inside_country_npz(dataset, country, data_date[1], data_date[2], data_date[0])
    print(data)
    avg_year = []
    for i in data:
        # a = np.round(np.nanmean(i.flatten()),4),4
        avg_year.append(np.round(np.nanmean(i.flatten()), 4))
    avg = np.round(np.mean(avg_year), 4)
    if index == 'pr':
        unit = "mm"
    else:
        unit = "°C"

    return jsonify(avg_year, avg, unit)

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
    # country = "India"
    f = read_folder_rcp(dataset, index, type_, rcp, startyear, stopyear, 'h')
    # print("type",type_)
    if type_ == 'y':
        data_date = select_data_fromdate_year(f)
        print("shape",data_date[0][0])
    elif type_ == 'm':
        data_date = select_data_fromdate(f, startyear, stopyear, startmonth, stopmonth)
    # data_date = select_data_fromdate(f, startyear, stopyear, startmonth, stopmonth)
    data = mask_inside_country_npz(dataset+'_'+ rcp, country, data_date[1], data_date[2], data_date[0])
    # print("data",data[0])
    avg_year = []
    for i in data:
        # a = np.round(np.nanmean(i.flatten()),4),4
        avg_year.append(np.round(np.nanmean(i.flatten()), 4))
    avg = np.round(np.mean(avg_year), 4)
    if index == 'pr':
        unit = "mm"
    else:
        unit = "°C"

    return jsonify(avg_year, avg, unit)

@app.route("/api/na_anomaly", methods=['GET'])
def nc_anomaly():
    index = str(request.args.get("index"))
    if index == 'tas':
        name = 'station Tas'
        year = [1901, 1902, 1903, 1904, 1905]
        data = [-3, 6, -19, 32, 1]
        res = {'name': name, 'year': year, 'value': data}
    elif index == 'pr':
        name = 'station Pr'
        year = [1901, 1902, 1903, 1904, 1905]
        data = [25, -2, 19, -32, 1]
        res = {'name': name, 'year': year, 'value': data}

    return jsonify(res)

# ------------------------------test----------------------------------------------
@app.route("/netcdf",methods=["GET"])
def get_varlatlon():
    ds = Dataset("C:/Mew/Project/CRU TS/cru_ts4.04.1901.2019.pre.dat.nc")
    # print(ds)
    temp = ds.variables['pre'][:].filled()
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

@app.route('/test_NC', methods=['GET'])
def get_nc():
    start = time.time()
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    f = read_folder_nc(dataset, index, startyear, stopyear)
    get_data = select_data_fromdate_nc(
        f, startyear, stopyear, startmonth, stopmonth)
    lat = get_data[1]
    lon = get_data[2]
    # เฉลี่ยแต่ละจุดของทุกปี shape (จำนวนจุด)
    res = np.nanmean(get_data[0][:], axis=0).flatten()
    resp = np.where(np.isnan(res), None, res)
    max_ = np.round(np.nanmax(res), 4)
    Min, Max = range_boxplot(res)
    lat_lon_st = lat_lon(lat, lon)
    if index == 'pre':
        color = 'dry_wet'
    else:
        color = 'cool_warm'
    # return 'test'
    return jsonify(lat_lon_st.get('lon'), lat_lon_st.get('lat'), resp.tolist(), np.float64(Min), np.float64(Max), lat_lon_st.get('lon_step'), lat_lon_st.get('lat_step'), color)

@app.route('/')
def hello_world():
    return 'Hello, World!'

    
if __name__ == '__main__':
    app.run(debug=True, port=5000)
