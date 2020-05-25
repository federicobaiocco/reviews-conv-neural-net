from flask import Flask,request,jsonify
from reviews_cnn_package.model.predict import predict
from reviews_cnn_package.model.train_pipeline import train_model
from reviews_cnn_package.config import config

app = Flask(__name__)
@app.route('/')
def index():
    return "Index Page"

@app.route('/health', methods=['GET'])
def health():
    if request.method == 'GET':
        #_logger.info('health status OK')
        return 'ok'

@app.route('/predict', methods=['POST'])
def make_prediction():
    print(request)
    if request.method == 'POST':
        request_json_data = request.json
        review_text = request_json_data['review_text']

        result = predict(review = review_text)
        
        return jsonify(
            {'prediction': str(result['prediction']),
             'model_version': str(config.MODEL_VERSION)})

@app.route('/train', methods=['POST'])
def train():
    result = train_model()
    return jsonify(result)

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)