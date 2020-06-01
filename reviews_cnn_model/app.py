from flask import Flask,request,jsonify
from reviews_cnn_package.model.predict import predict
from reviews_cnn_package.model.train_pipeline import train_model
from reviews_cnn_package.config import config
import os
import json
import datetime
from bson.objectid import ObjectId
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, support_credentials=True)

if(os.environ.get('env') == 'prod'):
    app.config['MONGO_URI'] = os.environ.get('DB')
else:
    app.config['MONGO_URI'] = 'mongodb://localhost:27017/reviews_db'
mongo = PyMongo(app)

@app.route('/')
def index():
    return "Reviews"

@app.route('/health', methods=['GET'])
def health():
    if request.method == 'GET':
        return 'ok'

@app.route('/predict', methods=['POST'])
@cross_origin(supports_credentials=True)
def make_prediction():
    print(request)
    if request.method == 'POST':
        request_json_data = request.json
        review_text = request_json_data['review_text']
        
        result = predict(review = review_text)
        
        if result['prediction']['approved'] > 0.5:
            prediction = 1
        else:
            prediction = 0

        review = {
            "text": review_text,
            "prediction": prediction,
            "checked": 0,
            "true_label": None
        }
        _id = mongo.db.reviews.insert_one(review)

        return jsonify(
            {'prediction': str(result['prediction']),
            '_id': str(_id),
            'model_version': str(config.MODEL_VERSION)})

@app.route('/reviews', methods=['GET', 'POST', 'PATCH'])
@cross_origin(supports_credentials=True)
def review():
    '''
    review: {
        text: String,
        prediction: Bool,  # 1 = Approved ; 0 = Disapproved
        true_label: Bool,  # 1 = Approved ; 0 = Disapproved
        checked: Bool
    }
    '''
    request_json = request.json

    if request.method == 'GET':
        documents = mongo.db.reviews.find({})
        response = []
        for document in documents:
            document['_id'] = str(document['_id'])
            response.append(document)
        return jsonify(response[:10]), 200

    if request.method == 'POST':
        if request_json.get('text', None) is not None and \
            request_json.get('prediction', None) is not None:
            request_json['checked'] = 0 # Default value
            request_json['true_label'] = None # Default value
            mongo.db.reviews.insert_one(request_json)
            return jsonify({'OK': True, 'message': 'Created'}), 200
        else:
            return jsonify({'OK': False, 'message': 'Required params are missing'}), 400

    if request.method == 'PATCH':
        query = request_json.get('query', {})
        query['_id'] = ObjectId(query['_id'])
        payload = request_json.get('payload', {})
        if query != {}:
            mongo.db.reviews.update_one(
                query, {'$set': payload})
            
            if(payload['checked'] == 1):
                review = mongo.db.reviews.find_one(query, {"_id": False, "text": True, "true_label": True})
                train_review = {
                    "text": review['text'],
                    "state": review['true_label']
                }
                mongo.db.train_data.insert_one(train_review)

            return jsonify({'OK': True, 'message': 'Record updated'}), 200
        else:
            return jsonify({'OK': False, 'message': 'Required params are missing'}), 400

@app.route('/reviews/approved', methods=['GET'])
@cross_origin(supports_credentials=True)
def approved_reviews():
    if request.method == 'GET':
        documents = mongo.db.reviews.find({
            "$or" : [
                {"$and": [
                    {"checked": 1},
                    {"true_label": 1}
                ]},
                {"$and": [
                    {"checked": 0},
                    {"prediction": 1}
                ]}
            ]
            })
        response = []
        for document in documents:
            document['_id'] = str(document['_id'])
            response.append(document)
        return jsonify(response[:10]), 200

@app.route('/train_data', methods=['GET', 'POST', 'PATCH'])
@cross_origin(supports_credentials=True)
def train_data():
    '''
    train_data: {
        text: String,
        state: Bool -> 1 = Approved ; 0 = Disapproved
    }
    '''

    if request.method == 'GET':
        documents = mongo.db.train_data.find({})
        response = []
        for document in documents:
            document['_id'] = str(document['_id'])
            response.append(document)
        return jsonify(response), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)