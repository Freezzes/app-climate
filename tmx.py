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
import  netCDF4
import datetime
from itertools import groupby

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
        # print(new_df)
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
        print(post)
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
        print(data)
        l.append(data[station])

    for i in range(len(l)):
        if 'nan' == str(l[i]):
            collect.append("-")
        else :
            collect.append(l[i])
    print(len(l))
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
    print("dff f",dff)
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
        print(k)
        print(o)
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
                        print(r['station'],v['value'])
                        outbox.append(v['value'])
                    print(outbox)
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
#         print(k)
#         print(o)
#         # o=[]

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
    if showtype =='month':
        b = byear(df,res,start_date,end_date)
    elif showtype =='year':
        b = boxplotyear(df,res,start_date,end_date)
    
    print("station : ", station)
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
        print(k)
        print(o)
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
                        print(r['station'],v['value'])
                        outbox.append(v['value'])
                    print(outbox)
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
    print("station : ", station)
    return jsonify(b)

# ------- LINE ANOMALY -------------------------------------------------------------
@app.route('/api/line',methods=["GET"])
def lineplot():
    df = str(request.args.get("df"))
    if df == 'mean':
        df = tmean
    elif df == 'min':
        df = tmin
    elif df == 'max':
        df = tmax
    elif df == 'pre':
        df = rain

    group_year = df.groupby('year')
    year = list(set(df['year']))
    station = str(request.args.get("station"))
    print( "station ::::: ", station, type(station))
    # res = station.strip('][').split(',')
    dt = df[[station,'year']]
    group_year = dt.groupby('year')
    grouplist = []
    for i in year:
        m = group_year.get_group(i).mean()
        grouplist.append(m[0])
    mask = (dt['year'] >= 1970) & (df['year'] <= 1999)
    baseline = dt.loc[mask]
    bs = baseline[station].mean()
    anamol = []
    for i in range(len(grouplist)):
        a = grouplist[i]-bs
        if str(a)=='nan':
            anamol.append('-')
        else:
            anamol.append(float("%.2f"% a))
    ana = {station:anamol}
    year = {'year':year}
    # listplot = []
    # anomaly = {}
    # for i in range(len(year)):
    #     anomaly['year'] = year[i]
    #     if str(anamol[i])== str('nan'):
    #         anomaly['value'] = '-'
    #     else:
    #         anomaly['value'] = anamol[i]
    #     listplot.append(anomaly)
    #     anomaly = {}
    return jsonify(ana,year)
#----------------------------map-------------------------------------
@app.route("/nc_csv",methods=["GET"])
def get_tomap():
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    print("year",startyear)
    ds = pd.read_csv("C:/Users/ice/Documents/climate/data/tmp_01-19_resize.csv")
    df1 = ds.query('{} <= year <= {} &  {} <=month<= {}'.format(startyear,stopyear,startmonth,stopmonth))
    select = df1[['lat','lon','values']].to_json(orient='records')
    select = json.loads(select)
    print (select[0])
    return jsonify(select)

#----------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port= 5500)
