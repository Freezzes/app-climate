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
# from netCDF4 import Dataset

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'tmean','rain5','rain','tmax','test'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/Project'

mongo = PyMongo(app)
CORS(app)

df = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/tmean1951-2015.csv")

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
    return groups2

@app.route('/api/plot', methods=['GET'])
def plot():
    df = pd.read_csv('C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/tmean_2012-2015_d.csv', index_col=-1, parse_dates=True)
    new_df = df.iloc[:, 0:7]
        
    pt = pd.pivot_table(new_df, index=new_df.index.month, columns=new_df.index.year, aggfunc='mean')
    
    pt.columns = pt.columns.droplevel() # remove the double header (0) as pivot creates a multiindex.
    a = pt.iloc[:,0:4]

    list1 = []
    for i in range(len(a)):
        list1.append({'y2012': a.values[i][0], 'y2013': a.values[i][1], 'y2014': a.values[i][2], 'y2015': a.values[i][3]})
    
    return jsonify(list1)

#----------------------------------------------------------------------------------------------------------------------
@app.route('/api/test1', methods = ['POST'])
def getmonthdata():
    month = request.args.get("month")
    year = request.args.get("year")
    station = request.args.get("station")
    l = []
    data = mongo.db.test.find({ "$and" : [{ "month" : int(month) }, { "year" : int(year) } ] } ,
                                {station:1})
    for d in data:
        l.append(d[station])
    return {"data": l}

#----------------------------------------------------------------------
@app.route('/api/range', methods = ['POST'])
def getmonthrange():
    station = request.args.get("station")
    from_date = int(request.args.get("from_date"))
    to_date = int(request.args.get("to_date"))+1
    # year = []
    l = []
    for post in mongo.db.tmean.find({"year": {"$gte": from_date, "$lt": to_date}  } ):
        l.append(post[station])
    return jsonify(l)  

#-----------------------------------------------------------------------
@app.route('/api/rangeyear', methods = ['GET'])
def getvalueselect():
    station = request.args.get("station")
    startyear = int(request.args.get("startyear"))
    endyear = int(request.args.get("endyear"))
    startmonth = int(request.args.get("startmonth"))
    endmonth = int(request.args.get("endmonth"))
    startday = int(request.args.get("startday"))
    endday = int(request.args.get("endday"))
    l = []
    collect = []

    for data in mongo.db.tmean.find({"date":{'$gte': datetime.datetime(startyear,startmonth,startday, 0, 0),
                                              '$lt': datetime.datetime(endyear,endmonth,endday, 0, 0) }},
                                    {station:1}):
        
        l.append(data[station])

    for i in range(len(l)):
        if 'nan' == str(l[i]):
            collect.append("-")
        else :
            collect.append(l[i])
    
    return jsonify(collect)  


@app.route('/api/rangecsv', methods=['GET'])
def getrange():
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    station = request.args.get("station")
    df1 = df.query('{} <= year <= {} &  {} <=month<= {}'.format(startyear,stopyear,startmonth,stopmonth))
    select = df1[[station,"month",'year']].to_json(orient='records')
    select = json.loads(select)
    return jsonify(select)

#-----    RAIN DATA -----------------------------------------------------------------------------------------------------------------

@app.route('/api/rain5', methods=['GET'])
def get_rain5():
    k = []
    v = []
    rain5 = []
    pre = mongo.db.rain5 
    
    for field in pre.find():
        field.pop('_id')

        for ky,val in field.items():
            if str(field[ky]) == str(np.nan):
                val = '-'
            else:
                pass            
            k.append(ky)
            v.append(val)
            dictionary = dict(zip(k, v))
        rain5.append(dictionary)

    return jsonify(rain5)

rain = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/rain1951-2018.csv")
@app.route('/api/rain', methods=['GET'])
def get_rain():
    k = []
    v = []
    rain = []
    pre = mongo.db.rain5 
    
    for field in pre.find():
        field.pop('_id')

        for ky,val in field.items():
            if str(field[ky]) == str(np.nan):
                val = '-'
            else:
                pass            
            k.append(ky)
            v.append(val)
            dictionary = dict(zip(k, v))
        rain.append(dictionary)

    return jsonify(rain)
#------------ MEAN TEMPERATURE ------------------------------------------------------------
@app.route('/api/meantemp', methods=['GET'])
def get_meantemp():
    k = []
    v = []
    tmean = []
    tmp = mongo.db.tmean 
    
    for field in tmp.find().limit(1000):
        field.pop('_id')
        for ky,val in field.items():
            if str(field[ky]) == str(np.nan):
                val = '-'
            else:
                pass
            k.append(ky)
            v.append(val)
            dictionary = dict(zip(k, v))
        tmean.append(dictionary)

    return jsonify(tmean)
    
#------------ MAX TEMPERATURE ------------------------------------------------------------
@app.route('/api/maxtemp', methods=['GET'])
def get_maxtemp():
    k = []
    v = []
    tmax = []
    tmp = mongo.db.tmax 
    
    for field in tmp.find():
        field.pop('_id')
        for ky,val in field.items():
            if str(field[ky]) == str(np.nan):
                val = '-'
            else:
                pass
            k.append(ky)
            v.append(val)
            dictionary = dict(zip(k, v))
        tmax.append(dictionary)

    return jsonify(tmax)
    
# station ----------------------------------------------------------------------------------

@app.route('/api/station', methods=['GET'])
def st():
    result = [{'300201':'แม่ฮ่องสอน'},
            {'432301':'สุรินทร์ สกษ.'}, 
            {'583201':'นราธิวาส'}]

    return jsonify(result)

#-----------------------------------------------------------------------------------------------------
datameantemp = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/tmean1951-2015.csv")
ds = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/tmean_station_startyear.csv")
ind = []
for i in range(len(ds['code'])):
    ind.append(ds['code'][i])
def getpercent(year,st):
    station = str(st)
    df1 = datameantemp.query('year == {}'.format(year))
    # select = df1[[station,"year"]].to_json(orient='records')
    missing = df1[[station]].isna().sum()
    all_row = len(df1[station])
    percent = (missing[0]/all_row)*100
    return percent
def getmissing():
    d = {}
    j = 0
    list_dict = []
    for c in datameantemp.columns[:-4]:
        if int(c) in ind:
            ye = ds.loc[(ds["code"] == int(c)) ]["year"]
            year_m = int(ye)
            for y in range(1951,2021):
                # if j == 1500:
                #     break
                va = getpercent(y,c)
                if str(va) != str(np.nan) :
                    if y < year_m:
                        d['station'] = c
                        d['x'] = int(ind.index(int(c)))  
                        d['y'] = y
                        d['value'] = "-"
                    else:
                        va = int(va)
                        d['station'] = c
                        d['x'] = ind.index(int(c)) 
                        d['y'] = y
                        d['value'] = va
                    list_dict.append(d)
                    d = {}
                    j +=1
    return list_dict
# data = getmissing()

# @app.route('/api/missing', methods=['GET'])

#--------------------------------------------------------------------------------------
mistmean = pd.read_csv('C:/Users/ice/Documents/climate/plot/climate/missingtmean.csv')
mistmax = pd.read_csv('C:/Users/ice/Documents/climate/plot/climate/missingtmax.csv')
mistmin = pd.read_csv('C:/Users/ice/Documents/climate/plot/climate/missingtmin.csv')
misrain = pd.read_csv('C:/Users/ice/Documents/climate/plot/climate/missingrain.csv')

def getm( startyear,stopyear,station,dff):
    d = {}
    list_dict = []
    
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
    if dff == 'mean':
        dff = mistmean
    elif dff == 'min':
        dff = mistmin
    elif dff == 'max':
        dff = mistmax
    elif dff == 'pre':
        dff = misrain

    v = getm( startyear,stopyear,res,dff)
    return jsonify(v)
#--------------------------------------------------------------------------------------
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
    if df == 'mean':
        df = tmean
    elif df == 'min':
        df = tmin
    elif df == 'max':
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
# BOXPLOT
tmean = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/tmean1951-2015.csv")
tmin = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/tmin1951-2016.csv")
tmax = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/tmax1951-2016.csv")
rain = pd.read_csv("C:/Users/ice/Documents/climate/TMD_DATA/TMD_DATA/clean_data/rain1951-2018.csv")
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
    if df == 'mean':
        df = tmean
    elif df == 'min':
        df = tmin
    elif df == 'max':
        df = tmax
    elif df == 'pre':
        df = rain
    b = boxplot(df,res,start_date,end_date)

    return jsonify(b)

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
    if dff =='mean' and station_region.values == 'North':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmean_station_north_Thailand.csv')
    elif dff =='mean' and station_region.values == 'Northeast':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmean_station_northest_Thailand.csv')
    elif dff =='mean' and station_region.values == 'Central' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmean_station_central_Thailand.csv')
    elif dff =='mean' and station_region.values == 'Eastern' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmean_station_eastern_Thailand.csv')
    elif dff =='mean' and station_region.values == 'South' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmean_station_south_Thailand.csv')
    elif dff =='min' and station_region.values == 'North':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmin_station_north_Thailand.csv')
    elif dff =='min' and station_region.values == 'Northeast':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmin_station_northest_Thailand.csv')
    elif dff =='min' and station_region.values == 'Central' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmin_station_central_Thailand.csv')
    elif dff =='min' and station_region.values == 'Eastern' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmin_station_eastern_Thailand.csv')
    elif dff =='min' and station_region.values == 'South' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmin_station_south_Thailand.csv')
    elif dff =='max' and station_region.values == 'North':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmax_station_north_Thailand.csv')
    elif dff =='max' and station_region.values == 'Northeast':
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmax_station_northest_Thailand.csv')
    elif dff =='max' and station_region.values == 'Central' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmax_station_central_Thailand.csv')
    elif dff =='max' and station_region.values == 'Eastern' :
        df = pd.read_csv('C:/Users/ice/Documents/climate/data/tmax_station_eastern_Thailand.csv')
    elif dff =='max' and station_region.values == 'South' :
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
    return jsonify(ana,year)

#-------------------------- NC ------------------------------------------------------
# ------------------- can't use Dataset from netCDF4 -------------------------------
# ------------------- don't know why and now this function error ---------------------
def anomalyNC():
    # df = Dataset("C:/Users/ice/Documents/climate/data/cru_ts4.04.1901.2019.tmp.dat.nc")
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
    dd = pd.read_csv('C:/Users/ice/Documents/climate/plot/tmp_anomaly_1901-2019.csv')
    an = []
    for i in dd['value']:
        an.append(float("%.2f"% i))
    y = []
    for i in dd['year']:
        y.append(i)
    ano = {'anomaly':an}
    year = {'year':y}
    return jsonify(ano,year)
#----------------------------map-------------------------------------
@app.route("/nc_csv",methods=["GET"])
def get_tomap():
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))

    ds = pd.read_csv("C:/Users/ice/Documents/climate/data/tmp_01-19_resize.csv")
    df1 = ds.query('{} <= year <= {} &  {} <=month<= {}'.format(startyear,stopyear,startmonth,stopmonth))
    select = df1[['lat','lon','values']].to_json(orient='records')
    select = json.loads(select)

    return jsonify(select)

# ----------------------------------- NC plot color --------------------------------------
ds1 = pd.read_csv("C:/Users/ice/Documents/climate/data/tmp_01-19_resize.csv")
ds2 = pd.read_csv("C:/Users/ice/Documents/climate/data/temp1911-20_resize.csv")
ds3 = pd.read_csv("C:/Users/ice/Documents/climate/data/temp1921-30_resize.csv")
ds_p = pd.read_csv("C:/Users/ice/Documents/climate/data/pre1901-10_resize.csv")
E = pd.read_csv("C:/Users/ice/Documents/climate/data/tas_1994.csv")

#-------------------------------NC DEFER ----------------------------------------------------
@app.route("/nc_defer",methods=["GET"])
def nc_defer():
    start = time.time()
    df_f = str(request.args.get("df_f"))
    start1 = int(request.args.get("start1"))
    stop1 = int(request.args.get("stop1"))
    start2 = int(request.args.get("start2"))
    stop2 = int(request.args.get("stop2"))
    if df_f == 'mean':
        color_map = 'cool_warm'
        lon_step = int(1)
        lat_step = int(1)
        if start1 <= 1910:
            ds = ds1
        elif start1 > 1910 and start1 <= 1920:
            ds = ds2
        elif start1 > 1920 and start1 <= 1930:
            ds = ds3
    elif df_f == 'pre':
        lon_step = int(1)
        lat_step = int(1)
        color_map = 'dry_wet'
        ds = ds_p
    elif df_f == 'EC':
        ds = E
        color_map = 'cool_warm'
        lon_step = float(0.703125)
        lat_step = float(0.703125)

    ds['time'] = pd.to_datetime(ds['time'] , format='%Y-%m-%d')
    df1 = ds.loc[(ds['time'].dt.year >= start1) & (ds['time'].dt.year <= stop1)]
    df2 = ds.loc[(ds['time'].dt.year >= start2) & (ds['time'].dt.year <= stop2)]
    N_data = pd.DataFrame()
    temp_lat = np.repeat(np.arange(-89.5, 89.6, 1),360)
    temp_lon = np.tile(np.arange(-179.5, 179.6, 1),180)
    n_val1 = df1.groupby(["lat", "lon"])['values'].mean()
    n_val2 = df2.groupby(["lat", "lon"])['values'].mean()
    n_val = n_val1-n_val2
    N_data['lat'] = temp_lat
    N_data['lon'] = temp_lon
    N_data['values'] = list(n_val)
    select = N_data[['lat','lon','values']].to_json(orient='records')
    select = json.loads(select)
   
    end = time.time()
    print(end-start)
    return jsonify(color_map,lon_step,lat_step,select)

#-----------------------------------------------per-----------------------------------------------
@app.route("/nc_per",methods=["GET"])
def nc_per():
    start = time.time()
    df_f = str(request.args.get("df_f"))
    start1 = int(request.args.get("start1"))
    stop1 = int(request.args.get("stop1"))
    start2 = int(request.args.get("start2"))
    stop2 = int(request.args.get("stop2"))
    if df_f == 'mean':
        color_map = 'cool_warm'
        lon_step = int(1)
        lat_step = int(1)
        if start1 <= 1910:
            ds = ds1
        elif start1 > 1910 and start1 <= 1920:
            ds = ds2
        elif start1 > 1920 and start1 <= 1930:
            ds = ds3
    elif df_f == 'pre':
        lon_step = int(1)
        lat_step = int(1)
        color_map = 'dry_wet'
        ds = ds_p
    elif df_f == 'EC':
        # ds = E
        color_map = 'cool_warm'
        lon_step = float(0.703125)
        lat_step = float(0.703125)

    ds['time'] = pd.to_datetime(ds['time'] , format='%Y-%m-%d')
    df1 = ds.loc[(ds['time'].dt.year >= start1) & (ds['time'].dt.year <= stop1)]
    df2 = ds.loc[(ds['time'].dt.year >= start2) & (ds['time'].dt.year <= stop2)]
    N_data = pd.DataFrame()
    temp_lat = np.repeat(np.arange(-89.5, 89.6, 1),360)
    temp_lon = np.tile(np.arange(-179.5, 179.6, 1),180)
    n_val1 = df1.groupby(["lat", "lon"])['values'].mean()
    n_val2 = df2.groupby(["lat", "lon"])['values'].mean()
    # n_val = n_val1-n_val2

    A1 = abs(n_val1-n_val2)
    A2 = (n_val1+n_val2)/2
    per = (A1/A2)*100
    print(per)
    N_data['lat'] = temp_lat
    N_data['lon'] = temp_lon
    N_data['values'] = list(per)
    select = N_data[['lat','lon','values']].to_json(orient='records')
    select = json.loads(select)
   
    end = time.time()
    print(end-start)
    return jsonify(color_map,lon_step,lat_step,select)

def get_Avgmap(df_f,startyear,stopyear,startmonth,stopmonth):
    start = time.time()
    # df_f = str(request.args.get("df_f"))
    # startyear = int(request.args.get("startyear"))
    # stopyear = int(request.args.get("stopyear"))
    # startmonth = int(request.args.get("startmonth"))
    # stopmonth = int(request.args.get("stopmonth"))
    print("year",startyear)
    if df_f == 'mean':
        color_map = 'cool_warm'
        lon_step = int(1)
        lat_step = int(1)
        if startyear <= 1910:
            ds = ds1
        elif startyear > 1910 and startyear <= 1920:
            ds = ds2
        elif startyear > 1920 and startyear <= 1930:
            ds = ds3
    elif df_f == 'pre':
        color_map = 'dry_wet'
        lon_step = int(1)
        lat_step = int(1)
        ds = ds_p
    elif df_f == 'EC':
        # ds = e
        color_map = 'cool_warm'
        lon_step = float(0.703125)
        lat_step = float(0.703125)

    ds['time'] = pd.to_datetime(ds['time'] , format='%Y-%m-%d')
    df1 = ds.loc[(ds['time'].dt.year >= startyear) & (ds['time'].dt.year <= stopyear) & (ds['time'].dt.month >= startmonth) & (ds['time'].dt.month <= stopmonth)]
    df1['values'] = df1['values'].replace([np.inf],np.nan)
    N_data = pd.DataFrame()
    temp_lat = np.repeat(np.arange(-89.5, 89.6, 1),360)
    temp_lon = np.tile(np.arange(-179.5, 179.6, 1),180)
    # temp_lat = np.repeat(np.arange(-90, 90, 0.703125),512)
    # temp_lon = np.tile(np.arange(-180, 180,  0.703125),256)
    # temp_lat = np.repeat(np.arange(-90, 92.5, 2.5),96)
    # temp_lon = np.tile(np.arange(-180, 180, 3.75),73)
    n_val = df1.groupby(["lat", "lon"])['values'].mean()
    Min = n_val.min()
    Max = np.nanmax(n_val)
    print(n_val.min())
    print(n_val.max())
    N_data['lat'] = temp_lat
    N_data['lon'] = temp_lon
    N_data['values'] = list(n_val)
    N_data['values'] = N_data['values'].replace([np.nan],np.inf)
    select = N_data[['lat','lon','values']].to_json(orient='records')
    select = json.loads(select)
    end = time.time()
    print(end-start)
    # print (select)
    # df1 = ds.query('{} <= year <= {} &  {} <=month<= {}'.format(startyear,stopyear,startmonth,stopmonth))
    # select = df1[['lat','lon','values']].to_json(orient='records')
    # select = json.loads(select)

    return color_map,lon_step,lat_step,select,Max,Min

# @app.route("/ec-earth",methods=["GET"])
def ec_earth(df_f,startyear,stopyear,startmonth,stopmonth):
    start = time.time()
    print("year",startyear)
    print("file",df)
    if df_f == 'mean':
        color_map = 'cool_warm'
        lon_step = int(1)
        lat_step = int(1)
        if startyear <= 1910:
            ds = ds1
        elif startyear > 1910 and startyear <= 1920:
            ds = ds2
        elif startyear > 1920 and startyear <= 1930:
            ds = ds3
    elif df_f == 'pre':
        color_map = 'dry_wet'
        # stepsize = int(1)
        ds = ds_p
    elif df_f == 'ec':
        # ds = E
        color_map = 'cool_warm'
        lon_step = float(0.703125)
        lat_step = float(0.703125)
    elif df_f == 'CDD':
        color_map = 'cool_warm'
        # ds = h
        lon_step = float(3.75)
        lat_step = float(2.5)
        
    
    ds['time'] = pd.to_datetime(ds['time'] , format='%Y-%m-%d')
    df1 = ds.loc[(ds['time'].dt.year >= startyear) & (ds['time'].dt.year <= stopyear) & (ds['time'].dt.month >= startmonth) & (ds['time'].dt.month <= stopmonth)]
    df1['values'] = df1['values'].replace([np.inf],np.nan)
    N_data = pd.DataFrame()
    temp_lat = np.repeat(np.arange(-90, 90, 0.703125),512)
    temp_lon = np.tile(np.arange(-180, 180,  0.703125),256)
    # temp_lat = np.repeat(np.arange(-90, 92.5, 2.5),96)
    # temp_lon = np.tile(np.arange(-180, 180, 3.75),73)
    n_val = df1.groupby(["lat", "lon"])['values'].mean()
    Min = n_val.min()
    Max = n_val.max()
    print(n_val.min())
    print(n_val.max())
    N_data['lat'] = temp_lat
    N_data['lon'] = temp_lon
    N_data['values'] = list(n_val)
    N_data['values'] = N_data['values'].replace([np.nan],np.inf)
    select = N_data[['lat','lon','values']].to_json(orient='records')
    select = json.loads(select)
    end = time.time()
    print(end-start)
    print (select[0])

    return color_map,lon_step,lat_step,select,Max,Min

@app.route('/nc_avg',methods=['GET'])
def selectNC():
    ncfile = str(request.args.get("ncfile"))
    df_f = str(request.args.get("df_f"))
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    if ncfile == 'CRU TS':
        a = get_Avgmap(df_f,startyear,stopyear,startmonth,stopmonth)
        # print("CRU A : ")
    elif ncfile == 'EC-Earth':
        a = ec_earth(df_f,startyear,stopyear,startmonth,stopmonth)
        # print("ec earth a : ")
    return jsonify(a)

#--------------------------------station---------------------------------------
@app.route('/locat/station',methods=['GET'])
def locat():
    ds = pd.read_csv("C:/Users/ice/Documents/climate/station/station_ThailandTMD.csv")
    select = ds[['id','name','latitude','longitude']].to_json(orient='records')
    select = json.loads(select)
    return jsonify(select)
    # df_f = str(request.args.get("df_f"))
    # if df_f == 'mean':
    #     ds = pd.read_csv("C:/Users/ice/Documents/climate/data/station_column_format/Tmean_Station_2012_2015.csv")
    # # elif df_f == 'pre':
    # #     ds = ds_p
    # # elif df_f == 'ec':
    # #     ds = E
        
    # df = pd.read_csv("C:/Users/ice/Documents/climate/data/station_column_format/station_ThailandTMD.csv")
    # df['Avg_val'] = "" 
    # col = ds.columns[3:-1]
    # for i in range(len(col)):
    #     df['Avg_val'][i] = ds.loc[ds['year'] == 2015, col[i]].mean(skipna = True)
    # select = df[['id','name','latitude','longitude','Avg_val']].to_json(orient='records')
    # select = json.loads(select)
    # print(select)
    # return jsonify(select)
#----------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port= 5500)
