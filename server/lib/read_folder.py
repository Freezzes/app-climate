import numpy as np
import os
import time
import pandas as pd
import json
from netCDF4 import Dataset

def check_range(dataset,index,startyear,stopyear):
    df = pd.read_csv('C:/Mew/Project/index_detail.csv')
    query = df.loc[(df['dataset']==dataset)&(df['index']==index)]
    select = query['year'].values #.to_json(orient='records')
    spl = select[0].split('-')

    if startyear in range(int(spl[0]),int(spl[1])+1):
        if stopyear in range(int(spl[0]),int(spl[1])+1):
            return {'check':'have data'}
        else:
            return {'check':'no data','year':select[0]}
    else:
        return {'check':'no data','year':select[0]}
 

def read_folder(dataset, index, startyear, stopyear,res):
    folder = f"C:/Mew/DB climate/{dataset}_{res}_file/"
    l_path = []
    for _file in os.listdir(folder):
        for t in range(startyear,stopyear+1):
            if _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(t) :
                path = f'{folder}{_file}'
                l_path.append(path)
    # print("path",l_path)
    return l_path

def read_folder_h(dataset, index,startyear, stopyear):
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

def read_folder_difrcp(dataset, index,type_,rcp, start1,stop1, start2,stop2):
    l_path1 = []
    l_path2 = []
    folder = f"C:/Mew/DB climate/{dataset}_{rcp}_{type_}_h_file/"
    for _file in os.listdir(folder):
        for y1 ,y2  in zip(range(start1,stop1+1), range(start2,stop2+1)):
            if _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(y1) :
                path = f'{folder}{_file}'
                l_path1.append(path)
            elif _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(y2) :
                path = f'{folder}{_file}'
                l_path2.append(path)
    return l_path1,l_path2

def read_folder_rcp(dataset, index,type_,rcp, startyear, stopyear,res):
    folder = f"C:/Mew/DB climate/{dataset}_{rcp}_{type_}_{res}_file/"
    print("folder",folder)
    l_path = []
    for _file in os.listdir(folder):
        for t in range(startyear,stopyear+1):
            if _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(t) :
                path = f'{folder}{_file}'
                l_path.append(path)
    # print("path",l_path)
    return l_path

def select_data_fromdate(f,startyear,stopyear,startmonth,stopmonth):
    start = time.time()
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        if f[i][:-4].split("-")[-1] == str(startyear):
            val = np.nanmean(ds['value'][startmonth-1:12],axis=0)
        elif f[i][:-4].split("-")[-1] == str(stopyear):
            val = np.nanmean(ds['value'][:stopmonth],axis =0)
        else:
            val = np.nanmean(ds['value'][0:12],axis=0)

        V.append(val)
    end = time.time()
    print("data",len(V[0]))
    print("Time select data",end-start)
    return V,ds['lat'],ds['lon']


def read_folder_nc(dataset, index, startyear, stopyear):
    folder = f"C:/Mew/Project/{dataset}/"
    l_path = []
    for _file in os.listdir(folder):
        for t in range(startyear,stopyear+1):
            if _file[:-3].split("_")[0] == index and _file[:-3].split("_")[6] == str(t) :
            # if _file.split("_")[0] == index and _file.split("_")[6] == str(t) :
                path = f'{folder}{_file}'
                l_path.append(path)
    print("path",l_path)
    return l_path

def select_data_fromdate_nc(_file,startyear,stopyear,startmonth,stopmonth):
    start = time.time()
    V = []
    for i in range(len(_file)):
        ds = Dataset(_file[i])

        if _file[i][:-3].split("_")[6] == str(startyear):
            val = np.nanmean(ds['Ann'][startmonth-1:12],axis=0)
        elif  _file[i][:-3].split("_")[6] == str(stopyear):
            val = np.nanmean(ds['Ann'][:stopmonth],axis =0)
        else:
            val = np.nanmean(ds['Ann'][0:12],axis=0)

        V.append(val.data)
    end = time.time()
    print("Time select data",end-start)
    return V,ds['lat'],ds['lon']

def read_folder_csv(dataset, index, startyear, stopyear):
    folder = f"C:/Mew/Project/csv/"
    l_path = []
    for _file in os.listdir(folder):
        for t in range(startyear,stopyear+1):
            print(t)
            if _file.split(".")[1] == index and _file.split(".")[2] == str(t) :
                path = f'{folder}{_file}'
                l_path.append(path)
    # print("path",l_path)
    return l_path

def select_data_fromdate_year(f):
    start = time.time()
    V = []
    for i in range(len(f)):
        ds = np.load(f[i])
        val = ds['value'][:]
        print("111",val.shape)
        V.append(val)
    end = time.time()
    print("data",len(V[0]))
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

