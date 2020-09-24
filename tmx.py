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
    data = mongo.db.tmean.find({ "$and" : [{ "month" : int(month) }, { "year" : int(year) } ] } ,
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
    print(len(l))
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
        # ({"date":{'$gte': { "$and" : [{ "month" : int(startmonth) }, { "year" : int(startyear) }]},
        #            '$lt': { "$and" : [{ "month" : int(endmonth) }, { "year" : int(endyear) } ] },
        #                             {station:1}):
   
    
    # ({ "$and" : [{"month": {"$gte": startmonth, "$lt": endmonth}  }, 
    #                                             {"date": {"$gte": startyear, "$lt": endyear}  } ] } ,
                                    # ):      
        # l.append({"value":data[station],"month":data["month"],"year":data["year"]})
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
if __name__ == '__main__':
    app.run(debug=True, port= 5500)


