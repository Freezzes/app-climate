from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS 
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import time
from matplotlib import cm
import matplotlib.dates as mdates
import  netCDF4

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'test'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/cli'

mongo = PyMongo(app)
CORS(app)


result = []
@app.route('/api/tmean', methods=['GET'])

def get_value():
    tmp = mongo.db.test 
    
    for field in tmp.find():
        date = field['date']
        result.append({"s300201": field['300201'],"s432301": field['432301'],"date": date.strftime("%Y-%m-%d") })

    a = np.mean(field['300201'])
    print(a)




    return jsonify(result)

#----------------------------------------------------------------------------------------------------------------------

if __name__ == '__main__':
    app.run(debug=True, port= 5500)