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
import datetime
from itertools import groupby
from netCDF4 import Dataset
import pymannkendall as mk
import statsmodels.api as sm
from datetime import datetime
import os

from lib.function import range_boxplot
# from lib.mymongo import Mongo
# from lib.Calculate import Calculate_service
# from lib.Percent_different import Percent_service
app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'tmean','rain5','rain','tmax','test'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/Project'

# client = pymongo.MongoClient('mongodb://localhost:27017/')
# database = "test"

mongo = PyMongo(app)
CORS(app)


#----------- Missing Value ---------------------------------------------------------------------------
mistmean = pd.read_csv('C:/Users/ice/Documents/climate/plot/map/missingtmean.csv')
mistmax = pd.read_csv('C:/Users/ice/Documents/climate/plot/map/missingtmax.csv')
mistmin = pd.read_csv('C:/Users/ice/Documents/climate/plot/map/missingtmin.csv')
misrain = pd.read_csv('C:/Users/ice/Documents/climate/plot/map/missingrain.csv')

def getm( startyear,stopyear,station,dff):
    d = {}
    list_dict = []
    print("missing value : ",dff)
    mask = (dff['y'] >= startyear) & (dff['y'] <= stopyear)
    dat = dff.loc[mask]
    for i in station:
        a = (int(i))
        b = dat.loc[dat['station'] == a]
        for i in b.index:
            d['station'] = str(b['station'][i])
            d['x'] = int(b['x'][i])
            d['y'] = int(b['y'][i])
            if str(b['value'][i])== str('-') :
                d['value'] = '-'
            else :
                d['value'] =int(b['value'][i])
            list_dict.append(d)
            d = {}
    return list_dict
@app.route('/api/selectmissing', methods=['GET'])
def selectmissing():
    dff = str(request.args.get("dff"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    sta = str(request.args.get("sta"))
    res = sta.strip('][').split(',') 
    if dff == 'tas':
        dff = mistmean
    elif dff == 'tasmin':
        dff = mistmin
    elif dff == 'tasmax':
        dff = mistmax
    elif dff == 'pre':
        dff = misrain
    print("missing file : ",dff)
    v = getm( startyear,stopyear,res,dff)
    return jsonify(v)

#---------------------- Map Thailand station---------------------------------------
@app.route('/locat/station',methods=['GET'])
def locat():
    df_f = str(request.args.get("df_f"))
    startdate = str(request.args.get("startdate"))    # '1980-10-01'
    stopdate = str(request.args.get("stopdate"))      # '1981-02-28'

    print(">>>>>>>>>>>>>>>>>>>>>>>>>>")
    print("df : ",df_f)
    print("date : ",startdate," + + + ",stopdate)
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
    # print(select)
    return jsonify(select,color_map)

#------------------------------------------------------------------------------------------------------
#---------- Boxplot Station----------------------------------------------------------------------------
tmean = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/tmean1951-2015.csv")
tmin = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/tmin1951-2016.csv")
tmax = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/tmax1951-2016.csv")
rain = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/rain1951-2018.csv")

def filter_by_station2(station,data,Upper,lower):
    check_month = []
    correct_value = []
    wrong_value = []
    #show dataframe only column month and station input
    df_station_month = data[station]
    df_station_month.index = data["month"]
    #list of value in station
    list_value = list(df_station_month)

    for index in range(len(df_station_month)):
        month = str(df_station_month.index[index])
        #get upper and lower value
        upper_value = Upper.loc[Upper["month"]==month][station]
        lower_value = lower.loc[lower["month"]==month][station]
        #check upper an lower
        if (list_value[index] > upper_value.item() or list_value[index] < lower_value.item()):
            check_month.append(month)
            correct_value.append({"month":month,"value":list_value[index]})
        else:
            wrong_value.append({"month":month,"value": "-"})

    wrong_value = list({v['month']:v for v in wrong_value}.values())
    for item in wrong_value:
        if item["month"] in check_month:
            pass
        else:
            correct_value.append(item)

    sort_correct_value = sorted(correct_value, key = lambda i: i['month'])
    c = 0
    o = []
    v = {}
    outd = []
    for k,v in groupby(sort_correct_value,key=lambda x:x['month']):
        for i in list(v):
            o.append([c,i["value"]])
        c+=1
        outd.append({'month':k,'value':o})

        # o=[]

    data_return = [{"station":int(station),"value":o}]

    return data_return

def byear(df,station,start_date,end_date):
    xname = []
    mask = (df['date'] >= start_date) & (df['date'] <= end_date)
    data = df.loc[mask]
    data['date'] = pd.to_datetime(data['date'])
    data['month'] = data['date'].dt.to_period("M")
    Q1 = data.groupby('month').quantile(0.25)
    Q2 = data.groupby('month').quantile(0.50)
    Q3 = data.groupby('month').quantile(0.75)
    IQR = Q3 - Q1
    Upper_Bound = Q3 + 1.5*IQR
    Lower_Bound = Q1 - 1.5*IQR
    minvalue = data.groupby(pd.Grouper(key='date', freq='M')).min() 
    maxvalue = data.groupby(pd.Grouper(key='date', freq='M')).max() 
    # meanvalue = data.groupby(pd.Grouper(key='date', freq='M')).mean() 
    lower = Lower_Bound.iloc[:,:-3]
    lowest = minvalue.iloc[:,:-3]
    Upper = Upper_Bound.iloc[:,:-3]
    maxx = maxvalue.iloc[:,:-3]
    for i in lower.columns:
        for j in range(len(lower[i])):
            if lower[i][j] > lowest[i][j]:
                pass
            else:
                lower[i][j] = lowest[i][j]
    for i in Upper.columns:
        for j in range(len(Upper[i])):
            if Upper[i][j] < maxx[i][j]:
                pass
            else:
                Upper[i][j] = maxx[i][j]
    listall = []
    listbox = []
    dataout = []


    for i in station:
        st = str(i)
        listall = lower[st], Q1[st], Q2[st], Q3[st], Upper[st]
        for i in range(len(listall[0])):
            temp = []
            for j in range(len(listall)):
                if str(listall[j][i]) == str(np.nan):
                    temp.append('-') 
                else:
                    temp.append(listall[j][i])
            dataout.append(temp)

    Upper['month'] = Upper.index
    lower['month'] = lower.index
    data = data.reset_index(drop=True) 
    outliers = []
    for i in station:
        outliers.append(filter_by_station2(str(i),data,Upper,lower))
    
    name = Q1.index
    for i in name :
        xname.append(str(i))
    
    outbox = []
    for i in listbox:
        for j in outliers:
            for r in j:
                if str(i['station']) == str(r['station']):
                    for v in r['value']:
                        outbox.append(v['value'])
                    
                    i['outliers']= outbox
                    outbox = []
    

    return dataout,xname,outliers

def filteryear_by_station(station,data,Upper,lower):
    check_month = []
    correct_value = []
    wrong_value = []
    #show dataframe only column month and station input
    df_station_month = data[station]
    df_station_month.index = data["year"]
    #list of value in station
    list_value = list(df_station_month)
    for index in range(len(df_station_month)):
        year = str(df_station_month.index[index])
        #get upper and lower value
        upper_value = Upper.loc[Upper["year"]==year][station]
        lower_value = lower.loc[lower["year"]==year][station]
              
        #check upper and lower
        if (list_value[index] > upper_value.item() or list_value[index] < lower_value.item()):
            check_month.append(year)
            correct_value.append({"year":year,"value":list_value[index]})
        else:
            wrong_value.append({"year":year,"value": "-"})
    
    wrong_value = list({v['year']:v for v in wrong_value}.values())
   
    for item in wrong_value:
        if item["year"] in check_month:
            pass
        else:
            correct_value.append(item)

    sort_correct_value = sorted(correct_value, key = lambda i: i['year'])
    c = 0
    o = []
    v = {}
    outd = []
    for k,v in groupby(sort_correct_value,key=lambda x:x['year']):
        for i in list(v):
            o.append([c,i["value"]])
        c+=1
        outd.append({'year':k,'value':o})



    data_return = [{"station":int(station),"value":o}]

    return data_return

def boxplotyear(df,station,start_date,end_date):
    xname = []
    mask = (df['date'] >= start_date) & (df['date'] <= end_date)
    data = df.loc[mask]
    data['date'] = pd.to_datetime(data['date'])
    data['year'] = data['date'].dt.to_period("Y")
    Q1 = data.groupby('year').quantile(0.25)
    Q2 = data.groupby('year').quantile(0.50)
    Q3 = data.groupby('year').quantile(0.75)
    IQR = Q3 - Q1
    Upper_Bound = Q3 + 1.5*IQR
    Lower_Bound = Q1 - 1.5*IQR
    minvalue = data.groupby(pd.Grouper(key='date', freq='Y')).min() 
    maxvalue = data.groupby(pd.Grouper(key='date', freq='Y')).max() 
    # meanvalue = data.groupby(pd.Grouper(key='date', freq='M')).mean() 
    lower = Lower_Bound.iloc[:,:-3]
    lowest = minvalue.iloc[:,:-3]
    Upper = Upper_Bound.iloc[:,:-3]
    maxx = maxvalue.iloc[:,:-3]
    for i in lower.columns:
        for j in range(len(lower[i])):
            if lower[i][j] > lowest[i][j]:
                pass
            else:
                lower[i][j] = lowest[i][j]
    for i in Upper.columns:
        for j in range(len(Upper[i])):
            if Upper[i][j] < maxx[i][j]:
                pass
            else:
                Upper[i][j] = maxx[i][j]
    listall = []
    listbox = []
    dataout = []


    for i in station:
        st = str(i)
        listall = lower[st], Q1[st], Q2[st], Q3[st], Upper[st]
        for i in range(len(listall[0])):
            temp = []
            for j in range(len(listall)):
                if str(listall[j][i]) == str(np.nan):
                    temp.append('-') 
                else:
                    temp.append(listall[j][i])
            dataout.append(temp)

    Upper['year'] = Upper.index
    lower['year'] = lower.index
    data = data.reset_index(drop=True) 
    outliers = []
    for i in station:
        outliers.append(filteryear_by_station(str(i),data,Upper,lower))
    
    name = Q1.index
    for i in name :
        xname.append(str(i))
    outbox = []
    for i in listbox:
        for j in outliers:
            for r in j:
                if str(i['station']) == str(r['station']):
                    for v in r['value']:
                        outbox.append(v['value'])
                    i['outliers']= outbox
                    outbox = []
    

    return dataout,xname,outliers

def filterseason_by_station(station,data,Upper,lower):
    check_month = []
    correct_value = []
    wrong_value = []
   
    df_station_month = data[station]
    df_station_month.index = data["season"]
    #list of value in station
    list_value = list(df_station_month)
    for index in range(len(df_station_month)):
        season = str(df_station_month.index[index])
        #get upper and lower value
        upper_value = Upper.loc[Upper["season"]==season][station]
        lower_value = lower.loc[lower["season"]==season][station]
              
        #check upper and lower
        if (list_value[index] > upper_value.item() or list_value[index] < lower_value.item()):
            check_month.append(season)
            correct_value.append({"season":season,"value":list_value[index]})
        else:
            wrong_value.append({"season":season,"value": "-"})
    
    wrong_value = list({v['season']:v for v in wrong_value}.values())
   
    for item in wrong_value:
        if item["season"] in check_month:
            pass
        else:
            correct_value.append(item)

    sort_correct_value = sorted(correct_value, key = lambda i: i['season'])
    c = 0
    o = []
    v = {}
    outd = []
    for k,v in groupby(sort_correct_value,key=lambda x:x['season']):
        for i in list(v):
            o.append([c,i["value"]])
        c+=1
        outd.append({'season':k,'value':o})


    data_return = [{"station":int(station),"value":o}]

    return data_return

def boxplotseason(df,station,start_date,end_date):
    # create a list of our conditions
    conditions = [
        (df['month'] >= 3) & (df['month'] <= 5),
        (df['month'] >= 6) & (df['month'] <= 8),
        (df['month'] >= 9) & (df['month'] <= 11),
        (df['month'] == 12) | (df['month'] == 1) | (df['month'] == 2),
        ]

    # create a list of the values we want to assign for each condition
    values = ['MAM', 'JJA', 'SON', 'DJF']

    # create a new column and use np.select to assign values to it using our lists as arguments
    df['season'] = np.select(conditions, values)
    
    xname = []
    mask = (df['date'] >= start_date) & (df['date'] <= end_date)
    data = df.loc[mask]
    data['date'] = pd.to_datetime(data['date'])
    Q1 = data.groupby('season').quantile(0.25)
    Q2 = data.groupby('season').quantile(0.50)
    Q3 = data.groupby('season').quantile(0.75)
    IQR = Q3 - Q1
    Upper_Bound = Q3 + 1.5*IQR
    Lower_Bound = Q1 - 1.5*IQR
    minvalue = data.groupby(pd.Grouper(key='season')).min() 
    maxvalue = data.groupby(pd.Grouper(key='season')).max() 
    lower = Lower_Bound.iloc[:,:-4]
    lowest = minvalue.iloc[:,:-4]
    Upper = Upper_Bound.iloc[:,:-4]
    maxx = maxvalue.iloc[:,:-4]
    for i in lower.columns:
        for j in range(len(lower[i])):
            if lower[i][j] > lowest[i][j]:
                pass
            else:
                lower[i][j] = lowest[i][j]
    for i in Upper.columns:
        for j in range(len(Upper[i])):
            if Upper[i][j] < maxx[i][j]:
                pass
            else:
                Upper[i][j] = maxx[i][j]
    listall = []
    listbox = []
    dataout = []


    for i in station:
        st = str(i)
        listall = lower[st], Q1[st], Q2[st], Q3[st], Upper[st]
        for i in range(len(listall[0])):
            temp = []
            for j in range(len(listall)):
                if str(listall[j][i]) == str(np.nan):
                    temp.append('-') 
                else:
                    temp.append(listall[j][i])
            dataout.append(temp)

    Upper['season'] = Upper.index
    lower['season'] = lower.index
    data = data.reset_index(drop=True) 
    outliers = []
    for i in station:
        outliers.append(filterseason_by_station(str(i),data,Upper,lower))
    
    name = Q1.index
    for i in name :
        xname.append(str(i))
    outbox = []
    for i in listbox:
        for j in outliers:
            for r in j:
                if str(i['station']) == str(r['station']):
                    for v in r['value']:
                        outbox.append(v['value'])
                    i['outliers']= outbox
                    outbox = []

    return dataout,xname,outliers

def filter_ERA_by_station(station,data,Upper,lower):
    check_month = []
    correct_value = []
    wrong_value = []
   
    df_station_month = data[station]
    df_station_month.index = data["era"]
    
    #list of value in station
    list_value = list(df_station_month)
    for index in range(len(df_station_month)):
        era = str(df_station_month.index[index])
        #get upper and lower value
        upper_value = Upper.loc[Upper["era"]==era][station]
        lower_value = lower.loc[lower["era"]==era][station]
              
        #check upper and lower
        if (list_value[index] > upper_value.item() or list_value[index] < lower_value.item()):
            check_month.append(era)
            correct_value.append({"era":era,"value":list_value[index]})
        else:
            wrong_value.append({"era":era,"value": "-"})
    wrong_value = list({v['era']:v for v in wrong_value}.values())
   
    for item in wrong_value:
        if item["era"] in check_month:
            pass
        else:
            correct_value.append(item)

    sort_correct_value = sorted(correct_value, key = lambda i: i['era'])
    c = 0
    o = []
    v = {}
    outd = []
    for k,v in groupby(sort_correct_value,key=lambda x:x['era']):
        for i in list(v):
            o.append([c,i["value"]])
        c+=1
        outd.append({'era':k,'value':o})

    data_return = [{"station":int(station),"value":o}]

    return data_return

def boxplotera(df,station,start_date,end_date):
    # create a list of our conditions
    df['era'] = "NaN"
    for v in df['year']:

        if v in range(1950,1960):
            df['era'].loc[df.year == v] = "1950s"
        elif v in range(1960,1970):
            df['era'].loc[df.year == v] = "1960s"
        elif v in range(1970,1980):
            df['era'].loc[df.year == v] = "1970s"
        elif v in range(1980,1990):
            df['era'].loc[df.year == v] = "1980s"
        elif v in range(1990,2000):
            df['era'].loc[df.year == v] = "1990s"
        elif v in range(2000,2010):
            df['era'].loc[df.year == v] = "2000s"
        elif v in range(2010,2020):
            df['era'].loc[df.year == v] = "2010s"
  
    xname = []
    mask = (df['date'] >= start_date) & (df['date'] <= end_date)
    data = df.loc[mask]
    data['date'] = pd.to_datetime(data['date'])
    Q1 = data.groupby('era').quantile(0.25)
    Q2 = data.groupby('era').quantile(0.50)
    Q3 = data.groupby('era').quantile(0.75)
    IQR = Q3 - Q1
    Upper_Bound = Q3 + 1.5*IQR
    Lower_Bound = Q1 - 1.5*IQR
    minvalue = data.groupby(pd.Grouper(key='era')).min() 
    maxvalue = data.groupby(pd.Grouper(key='era')).max() 
    lower = Lower_Bound.iloc[:,:-4]
    lowest = minvalue.iloc[:,:-4]
    Upper = Upper_Bound.iloc[:,:-4]
    maxx = maxvalue.iloc[:,:-4]
    for i in lower.columns:
        for j in range(len(lower[i])):
            if lower[i][j] > lowest[i][j]:
                pass
            else:
                lower[i][j] = float("%.2f"% lowest[i][j])
    for i in Upper.columns:
        for j in range(len(Upper[i])):
            if Upper[i][j] < maxx[i][j]:
                pass
            else:
                Upper[i][j] = float("%.2f"% maxx[i][j])
    listall = []
    listbox = []
    dataout = []


    for i in station:
        st = str(i)
        listall = lower[st], Q1[st], Q2[st], Q3[st], Upper[st]
        for i in range(len(listall[0])):
            temp = []
            for j in range(len(listall)):
                if str(listall[j][i]) == str(np.nan):
                    temp.append('-') 
                else:
                    temp.append(float("%.2f"% listall[j][i]))
            dataout.append(temp)

    Upper['era'] = Upper.index
    lower['era'] = lower.index
    data = data.reset_index(drop=True) 
    outliers = []
    for i in station:
        outliers.append(filter_ERA_by_station(str(i),data,Upper,lower))
    
    name = Q1.index
    for i in name :
        xname.append(str(i))
    outbox = []
    for i in listbox:
        for j in outliers:
            for r in j:
                if str(i['station']) == str(r['station']):
                    for v in r['value']:
                        outbox.append(v['value'])
                    i['outliers']= outbox
                    outbox = []
    

    return dataout,xname,outliers


@app.route('/api/boxplotvalue', methods=["GET"])
def selectboxplot2():
    df = str(request.args.get("df"))
    showtype = str(request.args.get("showtype"))
    station = str(request.args.get("station"))
    start_date = str(request.args.get("start_date"))
    end_date = str(request.args.get("end_date"))
    res = station.strip('][').split(',') 
    if df == 'tas':
        df = tmean
    elif df == 'tasmin':
        df = tmin
    elif df == 'tasmax':
        df = tmax
    elif df == 'pre':
        df = rain
    # drop columns
    if len(df.columns)==127:
        df = df.drop(df.columns[-1],axis=1)
        
    # calculate value
    if showtype =='month':
         b = boxplot(df,res,start_date,end_date)
    elif showtype =='year':
        b = boxplotyear(df,res,start_date,end_date)
    elif showtype =='season':
        b = boxplotseason(df,res,start_date,end_date)
    elif showtype =='era':
        b = boxplotera(df,res,start_date,end_date)

    return jsonify(b)

#--------------------------------------------------------------------
#-------------- BOXPLOT Multi Station Not use -----------------------
def filter_by_station(station,data,Upper,lower):
    check_month = []
    correct_value = []
    wrong_value = []
    #show dataframe only column month and station input
    df_station_month = data[station]
    df_station_month.index = data["month"]
    #list of value in station
    list_value = list(df_station_month)

    for index in range(len(df_station_month)):
        month = str(df_station_month.index[index])
        #get upper and lower value
        upper_value = Upper.loc[Upper["month"]==month][station]
        lower_value = lower.loc[lower["month"]==month][station]
        #check upper an lower
        if (list_value[index] > upper_value.item() or list_value[index] < lower_value.item()):
            check_month.append(month)
            correct_value.append({"month":month,"value":list_value[index]})
        else:
            wrong_value.append({"month":month,"value": "-"})

    wrong_value = list({v['month']:v for v in wrong_value}.values())
    for item in wrong_value:
        if item["month"] in check_month:
            pass
        else:
            correct_value.append(item)

    sort_correct_value = sorted(correct_value, key = lambda i: i['month'])
    c = 0
    o = []
    v = {}
    outd = []
    for k,v in groupby(sort_correct_value,key=lambda x:x['month']):
        for i in list(v):
            o.append([c,i["value"]])
        c+=1
        outd.append({'month':k,'value':o})

        o=[]

    data_return = [{"station":int(station),"value":outd}]

    return data_return

def boxplot(df,station,start_date,end_date):
    xname = []
    # station = ['300201','432301']
    # start_date = '1980-10-01'
    # end_date = '1981-02-31'
    mask = (df['date'] >= start_date) & (df['date'] <= end_date)
    data = df.loc[mask]
    data['date'] = pd.to_datetime(data['date'])
    # m = data['date'].dt.month
    data['month'] = data['date'].dt.to_period("M")
    Q1 = data.groupby('month').quantile(0.25)
    Q2 = data.groupby('month').quantile(0.50)
    Q3 = data.groupby('month').quantile(0.75)
    IQR = Q3 - Q1
    Upper_Bound = Q3 + 1.5*IQR
    Lower_Bound = Q1 - 1.5*IQR
    minvalue = data.groupby(pd.Grouper(key='date', freq='M')).min() 
    maxvalue = data.groupby(pd.Grouper(key='date', freq='M')).max() 
    # meanvalue = data.groupby(pd.Grouper(key='date', freq='M')).mean() 
    lower = Lower_Bound.iloc[:,:-3]
    lowest = minvalue.iloc[:,:-3]
    Upper = Upper_Bound.iloc[:,:-3]
    maxx = maxvalue.iloc[:,:-3]
    for i in lower.columns:
        for j in range(len(lower[i])):
            if lower[i][j] > lowest[i][j]:
                pass
            else:
                lower[i][j] = lowest[i][j]
    for i in Upper.columns:
        for j in range(len(Upper[i])):
            if Upper[i][j] < maxx[i][j]:
                pass
            else:
                Upper[i][j] = maxx[i][j]
    listall = []
    listbox = []
    dataout = []
    box = {}

    for i in station:
        st = str(i)
        listall = lower[st], Q1[st], Q2[st], Q3[st], Upper[st]
        for i in range(len(listall[0])):
            temp = []
            for j in range(len(listall)):
                if str(listall[j][i]) == str(np.nan):
                    temp.append('-') 
                else:
                    temp.append(listall[j][i])
            dataout.append(temp)
        box['station'] = st
        box['value'] = dataout
        listbox.append(box)
        dataout = []
        box = {}

    Upper['month'] = Upper.index
    lower['month'] = lower.index
    data = data.reset_index(drop=True) 
    outliers = []
    for i in station:
        outliers.append(filter_by_station(str(i),data,Upper,lower))
    
    name = Q1.index
    for i in name :
        xname.append(str(i))
    
    outbox = []
    for i in listbox:
        for j in outliers:
            for r in j:
                if str(i['station']) == str(r['station']):
                    for v in r['value']:
                        outbox.append(v['value'])
                    
                    i['outliers']= outbox
                    outbox = []
    

    return listbox,xname

@app.route('/api/boxplot', methods=["GET"])
def selectboxplot():
    df = str(request.args.get("df"))
    station = str(request.args.get("station"))
    start_date = str(request.args.get("start_date"))
    end_date = str(request.args.get("end_date"))
    res = station.strip('][').split(',') 
    if df == 'tas':
        df = tmean
    elif df == 'tasmin':
        df = tmin
    elif df == 'tasmax':
        df = tmax
    elif df == 'pre':
        df = rain
    b = boxplot(df,res,start_date,end_date)

    return jsonify(b)

#-----------------------------------------------------------------------------------
# ------- LINE ANOMALY -------------------------------------------------------------
#------------------------- STATION -------------------------------------------------
@app.route('/api/line',methods=["GET"])
def anomalyplot():    
    dff = str(request.args.get("dff"))
    station = str(request.args.get("station"))
    region = pd.read_csv('C:/Users/ice/Documents/climate/data/station_Thailand_region.csv')
    station_region = ''
    for i in region:
        for j in region[i] :
            if str(station) == str(j):
                station_region = region.loc[region['id']== int(station)]['region']
    if dff =='tas' and station_region.values == 'North':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmean_station_north_Thailand.csv')
    elif dff =='tas' and station_region.values == 'Northeast':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmean_station_northest_Thailand.csv')
    elif dff =='tas' and station_region.values == 'Central' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmean_station_central_Thailand.csv')
    elif dff =='tas' and station_region.values == 'Eastern' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmean_station_eastern_Thailand.csv')
    elif dff =='tas' and station_region.values == 'South' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmean_station_south_Thailand.csv')
    elif dff =='tasmin' and station_region.values == 'North':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmin_station_north_Thailand.csv')
    elif dff =='tasmin' and station_region.values == 'Northeast':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmin_station_northest_Thailand.csv')
    elif dff =='tasmin' and station_region.values == 'Central' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmin_station_central_Thailand.csv')
    elif dff =='tasmin' and station_region.values == 'Eastern' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmin_station_eastern_Thailand.csv')
    elif dff =='tasmin' and station_region.values == 'South' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmin_station_south_Thailand.csv')
    elif dff =='tasmax' and station_region.values == 'North':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmax_station_north_Thailand.csv')
    elif dff =='tasmax' and station_region.values == 'Northeast':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmax_station_northest_Thailand.csv')
    elif dff =='tasmax' and station_region.values == 'Central' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmax_station_central_Thailand.csv')
    elif dff =='tasmax' and station_region.values == 'Eastern' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmax_station_eastern_Thailand.csv')
    elif dff =='tasmax' and station_region.values == 'South' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmax_station_south_Thailand.csv')
    elif dff =='pre' and station_region.values == 'North':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/pre_station_north_Thailand.csv')
    elif dff =='pre' and station_region.values == 'Northeast':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/pre_station_northest_Thailand.csv')
    elif dff =='pre' and station_region.values == 'Central' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/pre_station_central_Thailand.csv')
    elif dff =='pre' and station_region.values == 'Eastern' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/pre_station_eastern_Thailand.csv')
    elif dff =='pre' and station_region.values == 'South' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/pre_station_south_Thailand.csv')

    mask = (df['year'] >= 1961) & (df['year'] <= 1990)
    baseline = df.loc[mask]
    bs = baseline.drop(columns=['date','day', 'month','year'])
    count = 0
    val = 0
    for i in bs:
        for j in bs[i]:
            if str(j) == str("nan"):
                pass
            else:
                val += j
                count +=1
    baseline_val = float("%.2f"% (val/count))
    group_year = df.groupby('year').mean()
    group_year = group_year.drop(columns=['day', 'month'])
    group_year['mean'] = group_year.mean(axis=1)
    index = 'mean'
    anomaly = group_year[index] - baseline_val
    a = anomaly.values.round(2)
    anomallist = []
    for i in range(len(a)) :
        if str(a[i])== str('nan'):
            anomallist.append('-')
        else :
            anomallist.append(a[i])
    ana = {str(station_region):anomallist}
    year = {'year':list(anomaly.index)}
    stationregion = list(station_region.values)
    return jsonify(ana,year,stationregion)

#-------------------------- NC ------------------------------------------------------
# ------------------- can't use Dataset from netCDF4 -------------------------------
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
    filename = str(request.args.get("filename"))
    if filename == 'tas':
        dd = pd.read_csv('C:/Users/ice/Documents/climate/manage_nc/tmp_anomaly_1901-2019.csv')
        name = ["Average Temperature"]
    elif filename == 'tasmin':
        dd = pd.read_csv('C:/Users/ice/Documents/climate/manage_nc/tmn_anomaly_1901-2019.csv')
        name = ["Minimum Temperature"]
    elif filename == 'tasmax':
        dd = pd.read_csv('C:/Users/ice/Documents/climate/manage_nc/tmx_anomaly_1901-2019.csv')
        name = ["Maximum Temperature"]
    elif filename == 'pre':
        dd = pd.read_csv('C:/Users/ice/Documents/climate/manage_nc/pre_anomaly_1901-2019.csv')
        name = ["Preciptipation"]

    an = []
    for i in dd['value']:
        an.append(float("%.2f"% i))
    y = []
    for i in dd['year']:
        y.append(i)
    ano = {'anomaly':an}
    year = {'year':y}
    namefile = {'name':name}
    return jsonify(ano,year,namefile)

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

#------------------ Manage NC file ----------------------------------
def read_folder_h(dataset, index, startyear, stopyear):
    folder = f"C:/Users/ice/Documents/managenc/{dataset}_h_file/"
    l_path = []
    for _file in os.listdir(folder):
        for t in range(startyear,stopyear+1):
            if _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(t) :
                path = f'{folder}{_file}'
                l_path.append(path)
    return l_path

# ----------------------------------map different-----------------------------------------
@app.route("/map_range1", methods=["GET"])
def map_range1():
    
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    print(index)
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
    # print(lon_step,lat_step)   
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return jsonify(y.tolist(),x.tolist(),val1.tolist(),Min,Max,lon_step,lat_step,color)

@app.route("/map_range1month", methods=["GET"])
def map_range1month():

    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    print(index)
    start = int(request.args.get("start"))
    stop = int(request.args.get("stop"))
    month = str(request.args.get("month")) # "[0,1,2,3]"
    res = month.strip('][').split(',') 
    selectmonth = []
    for i in res :
        selectmonth.append(int(i))

    print("select month : ",month)
    f = read_folder(dataset, index, start, stop)
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        val = ds['value'][selectmonth]
        val = np.mean(val, axis = 0)#.flatten()
        print("val :::::: ",val)
        V.append(val)
    res = np.nanmean(V[:], axis = 0)#.flatten()
    range1 = res.flatten()
    val1 = np.where(np.isnan(range1), None, range1)

    Min , Max = np.float64(range_boxplot(range1,index))

    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]
    # print(lon_step,lat_step)   
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
    print(index)
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
    # print(lon_step,lat_step)   
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return jsonify(y.tolist(),x.tolist(),val1.tolist(),lon_step,lat_step,color)

@app.route("/map_range2month", methods=["GET"])
def map_range2month():

    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    print(index)
    start = int(request.args.get("start"))
    stop = int(request.args.get("stop"))
    month = str(request.args.get("month")) # "[0,1,2,3]"
    res = month.strip('][').split(',') 
    selectmonth = []
    for i in res :
        selectmonth.append(int(i))

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
    # print(lon_step,lat_step)   
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return jsonify(y.tolist(),x.tolist(),val1.tolist(),lon_step,lat_step,color)

#--------------- high resolution ------------------------

@app.route('/nc_avg_hire', methods=['GET'])
def get_Avgmap_h():
    ncfile = str(request.args.get("ncfile"))
    df_f = str(request.args.get("df_f"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    print("dataset name : ",ncfile)
    print("index : ", df_f)
    f = read_folder_h(ncfile, df_f, startyear, stopyear)
    print(f)
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
        print(len(V))
    res = np.nanmean(V[:], axis = 0).flatten()
    print("------------",res.shape)
    resp = np.where(np.isnan(res), None, res)
    print(res)
    max_ = np.round(np.nanmax(res), 4)
    print(max_)

    Min , Max = range_boxplot(res,df_f)

    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]
    print(lon_step,lat_step)   
    if df_f == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return jsonify(y.tolist(),x.tolist(),resp.tolist(),np.float64(Min),np.float64(Max),np.float64(lon_step),np.float64(lat_step),color)

#--------------------------------- Low resolution---------------------------------------------------
# -----------------------------------------------per-----------------------------------------------
def read_folder_dif(dataset, index, start1,stop1, start2,stop2):
    print(">>>>>>>>>>>>>>>>....")
    l_path1 = []
    l_path2 = []
    folder = f"C:/Users/ice/Documents/managenc/{dataset}_l_file/"
    for _file in os.listdir(folder):
        for y1 ,y2  in zip(range(start1,stop1+1), range(start2,stop2+1)):
    #         print('letter' ,y1 ,'is number' ,y2,'from a and number')
            if _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(y1) :
                path = f'{folder}{_file}'
                l_path1.append(path)
            elif _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(y2) :
                path = f'{folder}{_file}'
                l_path2.append(path)
    return l_path1,l_path2

@app.route("/per_dif", methods=["GET"])
def per_dif():
    # start = time.time()
    dataset = str(request.args.get("ncfile"))
    index = str(request.args.get("df_f"))
    print(index)
    start1 = int(request.args.get("start1"))
    stop1 = int(request.args.get("stop1"))
    start2 = int(request.args.get("start2"))
    stop2 = int(request.args.get("stop2"))
    f = read_folder_dif(dataset, index, start1, stop1,start2,stop2)
    print("-------------",f[0])
    
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
    print(res.shape)
    print("type",type(res))
    dif = np.subtract(res1,res)
    per = ((dif/res)*100).flatten()
    per1 = np.where(np.isnan(per), None, per)
    
    print(per.shape)
    Min , Max = range_boxplot(per,index)
    Min1 , Max1 = range_boxplot(range1,index)
    Min2 , Max2 = range_boxplot(range2,index)
    print(type(Min1))

    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]
    # print(lon_step,lat_step)   
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

    print(res.shape)
    print("type",type(res))
    raw = np.subtract(res1,res).flatten()
    # per = ((dif/res)*100).flatten()
    raw1 = np.where(np.isnan(raw), None, raw)
    Min , Max = range_boxplot(raw,index)

    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]
    # print(lon_step,lat_step)   
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'


    return jsonify(y.tolist(),x.tolist(),raw1.tolist(),Min,Max,lon_step,lat_step,color,)

# -----------------------------------read folder----------------------------------------------------
def read_folder(dataset, index, startyear, stopyear):
    folder = f"C:/Users/ice/Documents/managenc/{dataset}_l_file/"
    l_path = []
    for _file in os.listdir(folder):
        for t in range(startyear,stopyear+1):
            if _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(t) :
                path = f'{folder}{_file}'
                l_path.append(path)
    return l_path

#-------------------- difference month selected ---------------------
@app.route("/nc_permonth", methods=["GET"])
def nc_permonth():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    print(">>>>>>>>>>>>> data information >>>>>>>>>>>>>")
    print(dataset)
    print(index)
    start1 = int(request.args.get("start1"))
    stop1 = int(request.args.get("stop1"))
    month = str(request.args.get("month")) # "[0,1,2,3]"
    res = month.strip('][').split(',') 
    selectmonth = []
    for i in res :
        selectmonth.append(int(i))

    f = read_folder(dataset, index, start1, stop1)
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
    # print(lon_step,lat_step)   
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return jsonify(y.tolist(),x.tolist(),val1.tolist(),Min,Max,lon_step,lat_step,color)

#------------------------ map trend ---------------------------------
def get_Avgmaptrend(dataset, index, startyear, stopyear, startmonth, stopmonth):
    f = read_folder(dataset, index, startyear, stopyear)
    print(f)
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
        print(len(V))

    trend = []
    for k in range(len(V[0][0])):
        for j in range(len(V[0])):
            lis = []
            for i in range(len(V)):
                if str(V[i][j][k]) == str(np.nan):
                    V[i][j][k] = 1E20
                lis.append(V[i][j][k])
            res = mk.original_test(lis,0.05)
            if res[0] == 'increasing':
                trend.append(1)
            elif res[0] == 'no trend':
                trend.append(0)
                print("-")
            else :
                trend.append(-1)
    
    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])
    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]
    print(lon_step,lat_step)   
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'

    return y.tolist(),x.tolist(),trend,lon_step,lat_step,color

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

def get_Avgmap(dataset, index, startyear, stopyear, startmonth, stopmonth):
    # start = time.time()
    f = read_folder(dataset, index, startyear, stopyear)
    print(f)
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
        print(len(V))
    res = np.nanmean(V[:], axis = 0).flatten() #เฉลี่ยแต่ละจุดของทุกปี shape (จำนวนจุด)    
    print("------------",res.shape)
    resp = np.where(np.isnan(res), None, res)
    print(res)
    max_ = np.round(np.nanmax(res), 4)
    print(max_)

    Min , Max = range_boxplot(res,index)
    
    x = np.repeat(ds['lat'], ds['lon'].shape[0])
    y = np.tile(ds['lon'], ds['lat'].shape[0])

    lat_step = ds['lat'][-1] - ds['lat'][-2]
    lon_step = ds['lon'][-1] - ds['lon'][-2]
    print(lon_step,lat_step)   
    if index == 'pr':
        color = 'dry_wet'
    else:
        color = 'cool_warm'
        print("type >>>>>>>>>>>>>>>>>>> ")

    print(type(lon_step))
    print(type(lat_step))


    return y.tolist(),x.tolist(),resp.tolist(),np.float64(Min),np.float64(Max),lon_step,lat_step,color

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

# ----------------------------------- NC plot color --------------------------------------
ds1 = pd.read_csv("C:/Users/ice/Documents/climate/data/tmp_01-19_resize.csv")
ds2 = pd.read_csv("C:/Users/ice/Documents/climate/data/temp1911-20_resize.csv")
ds3 = pd.read_csv("C:/Users/ice/Documents/climate/data/temp1921-30_resize.csv")
ds_p = pd.read_csv("C:/Users/ice/Documents/climate/data/pre1901-10_resize.csv")
E = pd.read_csv("C:/Users/ice/Documents/climate/data/tas_1994.csv")

# --------------------avg global chart-----------------------
@app.route("/api/global_avg", methods=['GET'])
def avg_global_year():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    startyear = int(request.args.get("startyear"))
    # startmonth = int(request.args.get("startmonth"))
    stopyear = int(request.args.get("stopyear"))
    # stopmonth = int(request.args.get("stopmonth"))
    year_list = range(int(startyear), int(stopyear)+1)
    print(year_list)
    print(startyear)
    # df = Dataset("C:/Mew/Project/CRU TS/cru_ts4.04.1901.2019.tmp.dat.nc")
    path = f'C:/Users/ice/Documents/climate/data/{dataset}.avg_global.csv'
    print(">>>path",path)
    df = pd.read_csv(path)
    if dataset == 'cru_ts':
        start_year = 1901
        end_year = 2019
    else:
        start_year = 1979
        end_year = 2014
    start_index = startyear - start_year
    end_index = stopyear - start_year
    # print("index :", start_index, end_index,end_year)
    # global_average= np.mean(df.variables['tmp'][:,:,:],axis=(1,2))
    # global_temp = np.mean(np.reshape(global_average, (119,12)), axis = 1)
    # result = global_temp[start_index:end_index+1].data.tolist()
    result = df[index][start_index:end_index+1].tolist()
    avg = np.round(np.mean(result), 4)
    if index == 'pr':
        unit = "mm"
    else:
        unit = "°C"
    print(result)

    return jsonify(result, avg, unit)

#---------------------------- db ---------------------------------------------
# @app.route("/api/get_grid", methods=['GET'])
# def get_grid():
#     start = time.time()
#     output = []
#     dataset = str(request.args.get("dataset"))
#     db = client['Project']
#     collection = db['dataset']
#     for d in collection.find({'dataset': dataset}, {'_id': 0}):
#         # print(d['gridsize']['lon_step'])
#         output.append({'geojson_gridcenter': d['geojson_gridcenter'],
#                        'lon_step': d['gridsize']['lon_step'], 'lat_step': d['gridsize']['lat_step']})
#     end = time.time()
#     # print('out',output)
#     print("get_grid:", end-start)
#     return jsonify(output)

# @app.route("/api/detail_index", methods=['GET'])
# def get_detail():
#     output = []
#     dataset = str(request.args.get("dataset"))
#     index = str(request.args.get("index"))
#     db = client['Project']
#     collection = db['index_detail']
#     for d in collection.find({'index': index}, {'_id': 0}):
#         output.append(
#             {'definition': d['definition'], 'color_map': d['color_map'],'unit':d['unit'],'type':d['type']})
#         # print(d['color_map'])

#     return jsonify(output)

#----------------------- Get detials ----------------------------------
@app.route("/api/detail", methods=['GET'])
def detail():
    dataset = str(request.args.get("dataset"))
    index = str(request.args.get("index"))
    df = pd.read_csv('C:/Users/ice/Documents/climate/data/index_detail.csv')
    print(df)
    query = df.loc[(df['dataset']=='cru_ts')&(df['index']=='tmp')]
    # res = jsonify(query['long name'][0],query['description'][0],query['unit'][0],query['year'][0])
    # color = jsonify(query['color_map'][0])
    select = query[['long name','description','unit','year','color_map']].to_json(orient='records')
    select = json.loads(select)
    return select[0]

#----------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port= 5500)
