import numpy as np
import pandas as pd
import json
import time
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

def _get_country_mask_arr(country, lats, lons):
    start = time.time()
    with open('C:/Users/Mewkk/app-climate/client/src/assets/map/geo-medium.json') as json_file:
        jsondata = json.load(json_file)
        for c in jsondata['features']:
            if c['properties']['name'] == country:
                country_json = c
                break

    country_polygon = country_json['geometry']['coordinates']
    coor = time.time()
    # print("get coor",coor-start)
    lats = np.array(lats)
    lons = np.array(lons)
    lats_step = np.abs(lats[0] - lats[1])
    lons_step = np.abs(lons[0] - lons[1])
    # create (lon, lat) order-pair
    grid_center_coor = np.transpose([np.tile(lons, len(lats)), np.repeat(lats, len(lons))])
    # create mask array
    mask_arr = np.zeros(len(lats) * len(lons))
    print("get coor",coor-start)
    for i, coordinate in enumerate(grid_center_coor):
        start1 = time.time()
        # center
        point1 = Point(coordinate)
        # edge
        point2 = Point([coordinate[0] - lons_step / 2, coordinate[1] - lons_step / 2])
        point3 = Point([coordinate[0] - lons_step / 2, coordinate[1] + lons_step / 2])
        point4 = Point([coordinate[0] + lons_step / 2, coordinate[1] - lons_step / 2])
        point5 = Point([coordinate[0] + lons_step / 2, coordinate[1] + lons_step / 2])
        cen = time.time()
       
        for p in country_polygon:
            try:
                p = np.squeeze(p, axis=0)
            except:
                p
            polygon = Polygon(p)
            if polygon.contains(point1) or polygon.contains(point2) or polygon.contains(point3) or polygon.contains(
                    point4) or polygon.contains(point5):
                mask_arr[i] = 1
                break
        
            end1 = time.time()
    print("end for",end1-cen)
    print("infor",cen-start1)
    mask_arr = mask_arr.reshape(len(lats), len(lons))
    end = time.time()
    print("for mask",end-coor)
    print("Time get mask",end-start)
    return mask_arr

def _get_continent_mask_arr(continent, lats, lons):
    start = time.time()
    with open('C:/Users/Mewkk/app-climate/client/src/assets/map/geo-medium.json') as json_file:
        jsondata = json.load(json_file)
        country_json = []
        for c in jsondata['features']:
            if c['properties']['continent'] == continent:
                country_json.append(c['geometry']['coordinates'])

    # country_polygon = country_json['geometry']['coordinates']
    Asia = []
    for i in range(len(country_json)):
        for j in range(len(country_json[i][0])):
            if len(country_json[i][0][j]) > 2:
                for c in range(len(country_json[i][0][j])):
                    Asia.append(country_json[i][0][j][c])
            else:
                Asia.append(country_json[i][0][j])
    #         break
    list_asia = [Asia]
    # list_asia

    lats = np.array(lats)
    lons = np.array(lons)
    lats_step = np.abs(lats[0] - lats[1])
    lons_step = np.abs(lons[0] - lons[1])
    # create (lon, lat) order-pair
    grid_center_coor = np.transpose([np.tile(lons, len(lats)), np.repeat(lats, len(lons))])
    # create mask array
    mask_arr = np.zeros(len(lats) * len(lons))

    for i, coordinate in enumerate(grid_center_coor):
        # center
        point1 = Point(coordinate)
        # edge
        point2 = Point([coordinate[0] - lons_step / 2, coordinate[1] - lons_step / 2])
        point3 = Point([coordinate[0] - lons_step / 2, coordinate[1] + lons_step / 2])
        point4 = Point([coordinate[0] + lons_step / 2, coordinate[1] - lons_step / 2])
        point5 = Point([coordinate[0] + lons_step / 2, coordinate[1] + lons_step / 2])

        for p in list_asia:
            try:
                p = np.squeeze(p, axis=0)
            except:
                p
            polygon = Polygon(p)
            if polygon.contains(point1) or polygon.contains(point2) or polygon.contains(point3) or polygon.contains(
                    point4) or polygon.contains(point5):
                mask_arr[i] = 1
                break

    mask_arr = mask_arr.reshape(len(lats), len(lons))
    end = time.time()
    print("_get_continent",end-start)

    return mask_arr