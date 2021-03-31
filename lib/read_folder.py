import numpy as np
import os

def read_folder(dataset, index, startyear, stopyear):
    folder = f"C:/Mew/DB climate/{dataset}_l_file/"
    l_path = []
    for _file in os.listdir(folder):
        for t in range(startyear,stopyear+1):
            if _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(t) :
                path = f'{folder}{_file}'
                l_path.append(path)
    return l_path

def read_folder_h(dataset, index, startyear, stopyear):
    folder = f"C:/Mew/DB climate/{dataset}_h_file/"
    l_path = []
    for _file in os.listdir(folder):
        for t in range(startyear,stopyear+1):
            if _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(t) :
                path = f'{folder}{_file}'
                l_path.append(path)
    return l_path

def read_folder_dif(dataset, index, start1,stop1, start2,stop2):
    l_path1 = []
    l_path2 = []
    folder = f"C:/Mew/DB climate/{dataset}_l_file/"
    for _file in os.listdir(folder):
        for y1 ,y2  in zip(range(start1,stop1+1), range(start2,stop2+1)):
            if _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(y1) :
                path = f'{folder}{_file}'
                l_path1.append(path)
            elif _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(y2) :
                path = f'{folder}{_file}'
                l_path2.append(path)
    return l_path1,l_path2

def select_data_fromdate(f,startyear,stopyear,startmonth,stopmonth):
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        if f[i][:-4].split("-")[1] == str(startyear):
            val = np.nanmean(ds['value'][startmonth-1:12],axis=0)
        elif f[i][:-4].split("-")[1] == str(stopyear):
            val = np.nanmean(ds['value'][:stopmonth],axis =0)
        else:
            val = np.nanmean(ds['value'][0:12],axis=0)

        V.append(val)
        
    return V,ds['lat'],ds['lon']

def lat_lon(lat,lon):
    x = np.repeat(lat, lon.shape[0])
    y = np.tile(lon, lat.shape[0])
    lat_step = lat[-1] - lat[-2]
    lon_step = lon[-1] - lon[-2] 
  
    return {'lon':y.tolist(),'lat':x.tolist(),'lon_step':lon_step,'lat_step':lat_step}


