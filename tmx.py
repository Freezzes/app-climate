from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS 

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'tmp2011'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/cli'

mongo = PyMongo(app)
CORS(app)

@app.route('/api/tmp2011', methods=['GET'])
def get_value():
    tmp = mongo.db.tmp2011 
    result = []
    for field in tmp.find().limit(10):
        print(field)
        result.append({'timeC': str(field['time']), 'lat': field['lat'], 'lon': field['lon'], 'temp': field['temp']})
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, port= 5500)