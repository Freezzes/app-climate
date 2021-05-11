import numpy as np
import pandas as pd

def range_boxplot(res): 
    min_ = np.round(np.nanmin(res), 4)
    max_ = np.round(np.nanmax(res), 4)

    mean = np.round(np.nanmean(res), 8)
    median = np.round(np.nanmedian(res), 7)

    quartile_1 = np.round(pd.Series(res).quantile(0.25), 8)
    quartile_3 = np.round(pd.Series(res).quantile(0.75), 8)

    # Interquartile rangeยั
    iqr = np.round(quartile_3 - quartile_1, 8)
    low = np.round(quartile_1 - (1.5 * iqr),5)
    hight = np.round(quartile_3 + (1.5 * iqr),5)

    Min = max(min_,low)
    Max = min(max_,hight)
    print('Min: %s' % min_)
    print('Max: %s' % max_)
    print('Mean: %s' % mean)
    print('25th percentile: %s' % quartile_1)
    print('Median: %s' % median)
    print('75th percentile: %s' % quartile_3)
    print('Interquartile range (IQR): %s' % iqr)
    print('1.5 IQR above the third quartile is: %s' %hight)
    print('1.5IQR below the first quartile is: %s' %low)
    if min_ == 0:
        return min_,max_
    else:
        return Min,Max

def data_to_map(get_data):
    lat = get_data[1]
    lon = get_data[2]
    res = np.nanmean(get_data[0][:], axis=0).flatten()
    resp = np.where(np.isnan(res), None, res)
    max_ = np.round(np.nanmax(res), 4)
    Min, Max = range_boxplot(res)
    lat_lon_st = lat_lon(lat, lon)

    return lat_lon_st.get('lon'), lat_lon_st.get('lat'), resp.tolist(), np.float64(Min), np.float64(Max), lat_lon_st.get('lon_step'), lat_lon_st.get('lat_step')

def select_data_fromdate(f,startyear,stopyear,startmonth,stopmonth):
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        if f[i][:-4].split("-")[-1] == str(startyear):
            val = np.nanmean(ds['value'][startmonth-1:12],axis=0)
        elif f[i][:-4].split("-")[-1] == str(stopyear):
            val = np.nanmean(ds['value'][:stopmonth],axis =0)
        else:
            val = np.nanmean(ds['value'][:],axis=0)

        V.append(val)
        
    return V,ds['lat'],ds['lon']

def select_data_fromyear(f):
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        val = np.nanmean(ds['value'][:],axis=0)

        V.append(val)
        
    return V,ds['lat'],ds['lon']

def lat_lon(lat,lon):
    x = np.repeat(lat, lon.shape[0])
    y = np.tile(lon, lat.shape[0])
    lat_step = lat[-1] - lat[-2]
    lon_step = lon[-1] - lon[-2] 
  
    return {'lon':y.tolist(),'lat':x.tolist(),'lon_step':lon_step,'lat_step':lat_step}

def select_data_fromdate_year(f):
    print("f",f)
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        val = ds['value'][:]
        V.append(val)
    return V,ds['lat'],ds['lon']

def select_data_fromdate_year_formk(f):
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        val = ds['value'][:]
        V.append(val.flatten())
    return V,ds['lat'],ds['lon']

def map_month(f):
    print("month",len(f))
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        val = ds['value'][:]
        val = np.nanmean(val, axis=0)  # .flatten()
        V.append(val)

    return V,ds['lat'],ds['lon']