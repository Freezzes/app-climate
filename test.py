import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import datetime
import time
from matplotlib import cm

df = pd.read_csv(r'C:/Users/ice/Documents/climate/TMD_DATA-20200902T042020Z-001/TMD_DATA/clean_data/tmean_2012-2015_d.csv', index_col=-1, parse_dates=True)
new_df = df.iloc[:, 0:7]
pt = pd.pivot_table(new_df, index=new_df.index.month, columns=new_df.index.year, aggfunc='mean')
pt.columns = pt.columns.droplevel() # remove the double header (0) as pivot creates a multiindex.


ax = plt.figure().add_subplot(111)
ax.plot(pt.iloc[:,0:4])

ticklabels = [datetime.date(1900, item, 1).strftime('%b') for item in pt.index]
ax.set_xticks(np.arange(1,13))
ax.set_xticklabels(ticklabels) #add monthlabels to the xaxis

ax.legend(pt.columns.tolist(), loc='center left', bbox_to_anchor=(1, .5)) #add the column names as legend.
plt.title("Tempurature station 300201")

plt.show()
