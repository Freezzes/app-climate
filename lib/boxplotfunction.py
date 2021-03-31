import pandas as pd
import numpy as np
import time
import json
from matplotlib import cm
import matplotlib.dates as mdates
import datetime
from itertools import groupby
from datetime import datetime

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
