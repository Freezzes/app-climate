import numpy as np
import pandas as pd
import json
import time
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
from pathlib import Path

curDir = Path("")
dataDir = curDir / "mask_country"

def mask_inside_country_npz(dataset,country, lats, lons, data):
    lats = np.array(lats)
    lons = np.array(lons)
    path = dataDir/f'{dataset}_high.npz'
    file_mask =  np.load(path,allow_pickle=True)
    mask = file_mask['mask'].tolist()
    mask_arr = mask.get(country)

    for y in range(len(data)):
        data[y] = np.where(mask_arr==1, np.array(data[y], dtype=np.float), np.nan)
    return data