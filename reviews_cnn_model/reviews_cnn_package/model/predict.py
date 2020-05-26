from tensorflow.keras.models import load_model
from reviews_cnn_package.config import config
import pickle

def predict(review: str) -> bool:
    model = load_model(config.MODEL_PATH)

    with open(config.TEXT_PROCESSOR_PATH, 'rb') as f:
        processor = pickle.load(f)

    preprocessed = processor.transform([review])

    prediction = model.predict(preprocessed)

    result = {
        'prediction': {
            'disapproved' : round(prediction[0][0]),
            'approved' : round(prediction[0][1]),
        }
    }
    return result