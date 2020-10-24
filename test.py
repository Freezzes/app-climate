import pandas as pd
import numpy as np
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
ss = [300201,431401]
startyear = 1951
endyear = 1999
def getmissing():
    d = {}
    j = 0
    list_dict = []
    for station in datameantemp.columns[:-4]:
        for stationselect in ss:
            if int(stationselect) in ind:
                ye = ds.loc[(ds["code"] == int(stationselect)) ]["year"]
                year_m = int(ye)
                for y in range(startyear,(endyear+1)):
    #                 if j == 1000:
    #                     break
                    va = getpercent(y,stationselect)
                    if str(va) != str(np.nan) :
                        if y < year_m:
                            d['station'] = stationselect
                            d['x'] = int(ind.index(int(stationselect)))  
                            d['y'] = y
                            d['value'] = "-"
                        else:
                            va = int(va)
                            d['station'] = stationselect
                            d['x'] = ind.index(int(stationselect)) 
                            d['y'] = y
                            d['value'] = va
                        if d in list_dict:
                            pass
                        else:
                            list_dict.append(d)
                        d = {}
                        j +=1
    return list_dict
data = getmissing()