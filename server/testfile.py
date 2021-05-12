from pathlib import Path
import pandas as pd
# import glob
import os

curDir = Path("")
dataDir = curDir / "managenc"
csvDir = curDir / "climate"
print(dataDir)

def read_folder(dataset, index, startyear, stopyear,res):
    folder = dataDir/f"{dataset}_{res}_file/"
    l_path = []
    for _file in os.listdir(folder):
        for t in range(startyear,stopyear+1):
            if _file[:-4].split("-")[0] == index and _file[:-4].split("-")[1] == str(t) :
                path = f'{folder}/{_file}'
                l_path.append(path)
    # print("path",l_path)
    return l_path

def check_range(dataset,index,startyear,stopyear):
    df = pd.read_csv(csvDir/'data/index_detail.csv')
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


dataset = 'ec-earth3'
index = 'tas'
startyear = 1990
stopyear = 2000
res = 'l'
print("CHECK RANGE")
print(check_range(dataset,index,startyear,stopyear))
print(read_folder(dataset, index, startyear, stopyear,res))