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
# def getmissingvalue():
#     return jsonify(data)

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
@app.route('/api/boxplotvalue', methods=['GET'])
def byear():
    xname = []
    all_data = []
    station = request.args.get("station")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    print("date : ", start_date,end_date,station)
 
    mask = (df['date'] >= start_date) & (df['date'] <= end_date)
    data = df.loc[mask]
    data['date'] = pd.to_datetime(data['date'])
    data['month'] = data['date'].dt.to_period("M")
    minvalue = data.groupby(pd.Grouper(key='date', freq='M')).min() 
    maxvalue = data.groupby(pd.Grouper(key='date', freq='M')).max() 
    meanvalue = data.groupby(pd.Grouper(key='date', freq='M')).mean() 

    Q1 = data.groupby('month').quantile(0.25)
    Q3 = data.groupby('month').quantile(0.75)
    list11 = minvalue[station], Q1[station], meanvalue[station], Q3[station], maxvalue[station]
    for i in range(len(list11[0])):
        temp = []
        for j in range(len(list11)):
            if str(list11[j][i]) == str(np.nan):
                temp.append('-') 
            else:
                temp.append(list11[j][i])
        all_data.append(temp)   
    a = Q1.index
    for i in a :
        xname.append(str(i))
    return jsonify(all_data,xname)

#----------------------------map-------------------------------------
@app.route("/nc_csv",methods=["GET"])
def get_tomap():
    startyear = int(request.args.get("startyear"))
    stopyear = int(request.args.get("stopyear"))
    startmonth = int(request.args.get("startmonth"))
    stopmonth = int(request.args.get("stopmonth"))
    print("year",startyear)
    ds = pd.read_csv("C:/Users/ice/Documents/climate/data/tmp8_1907.csv")
    df1 = ds.query('{} <= year <= {} &  {} <=month<= {}'.format(startyear,stopyear,startmonth,stopmonth))
    select = df1[['lat','lon','values']].to_json(orient='records')
    select = json.loads(select)
    return jsonify(select)

#----------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port= 5500)


