import numpy as np
import pandas as pd
from lib.country import _get_country_mask_arr,_get_continent_mask_arr
import time

def range_boxplot(res,index): 
    print(res)
    min_ = np.round(np.nanmin(res), 4)
    max_ = np.round(np.nanmax(res), 4)

    mean = np.round(np.nanmean(res), 2)
    median = np.round(np.nanmedian(res), 2)

    quartile_1 = np.round(pd.Series(res).quantile(0.25), 2)
    quartile_3 = np.round(pd.Series(res).quantile(0.75), 2)

    # Interquartile range
    iqr = np.round(quartile_3 - quartile_1, 2)
    low = np.round(quartile_1 - (1.5 * iqr),2)
    hight = np.round(quartile_3 + (1.5 * iqr),2)

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
    if index == 'pr':
        return min_,max_
    else:
        return Min,Max

def mask_inside_country(country, lats, lons, data):
    lats = np.array(lats)
    lons = np.array(lons)
    mask_arr = _get_country_mask_arr(country, lats, lons)

    for y in range(len(data)):
        data[y] = np.where(mask_arr==1, np.array(data[y], dtype=np.float), np.nan)

    return data

def mask_inside_continent(continent, lats, lons, data):
    start = time.time()
    lats = np.array(lats)
    lons = np.array(lons)
    print("dataaaaaaaa",data)
    mask_arr = _get_continent_mask_arr(continent, lats, lons)

    for y in range(len(data)):
        data[y] = np.where(mask_arr==1, np.array(data[y], dtype=np.float), np.nan)

    end= time.time()
    print("mask",end-start)
    return data
