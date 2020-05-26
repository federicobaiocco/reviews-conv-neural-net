import sys
import os
from reviews_cnn_package.config import config
from reviews_cnn_package.preprocessing import Text_preprocessor as tp
from reviews_cnn_package.model.model import make_model
from reviews_cnn_package.preprocessing import data_management as dm
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import pickle
from tensorflow.keras.models import load_model

def train_model(*, from_checkpoint: bool = False) -> dict:
    try:
        processor = tp.TextPreprocessor(test_split = config.TEST_SPLIT, pad_with = 'max_len')
        x_train, y_train, vocab_size, word_index, x_test, y_test = processor.fit_transform()
        texts_fixed_len = processor.get_padded_text_len()

        #Persist processor
        with open(config.TEXT_PROCESSOR_PATH, 'wb') as f:  # Python 3: open(..., 'wb')
            pickle.dump(processor, f)

        embedding_matrix, embeddings_vec_size = dm.load_embeddings(word_index)

        checkpoint = ModelCheckpoint(config.MODEL_PATH,
                                    monitor='val_acc', 
                                    verbose=1, 
                                    save_best_only=True, 
                                    mode='max')

        callbacks_list = [checkpoint, EarlyStopping(patience=config.EARLY_STOPPING_PATIENCE)]

        if from_checkpoint == False:
            model = make_model(word_index=word_index, 
                                embeddings_vec_size=embeddings_vec_size,
                                embedding_matrix = embedding_matrix,
                                texts_fixed_len = texts_fixed_len)
        else:
            model = load_model(config.MODEL_PATH)

        model.fit(x_train, y_train, 
                batch_size=config.BATCH_SIZE, 
                epochs=config.EPOCHS, 
                verbose=1, 
                callbacks=callbacks_list, 
                validation_data=(x_test, y_test))

        model.save(str(config.MODEL_PATH))

        return {'result': 'OK'}
    except:
        return {'result': 'Error'}


if __name__ == '__main__':
    train_model()