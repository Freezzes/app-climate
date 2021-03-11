import numpy as np
import pandas as pd

def range_boxplot(res,index): 
    print(index)
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