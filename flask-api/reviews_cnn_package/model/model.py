import os
import tensorflow.keras
from tensorflow.keras.layers import Activation, Conv2D, Input, Embedding, Reshape, MaxPool2D, Concatenate, Flatten, Dropout, Dense
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
from reviews_cnn_package.config import config

def make_model(*, word_index: object, 
                embeddings_vec_size: int,
                embedding_matrix: object, 
                texts_fixed_len: int) -> Model:
    '''
    Make text classification conv neural net.
    '''
    embedding_layer = Embedding(len(word_index) + 1,
                            embeddings_vec_size,
                            weights=[embedding_matrix],
                            input_length=texts_fixed_len,
                            trainable=False)
    inputs = Input(shape=(texts_fixed_len,), dtype='int32')
    embedding = embedding_layer(inputs)
    reshape = Reshape((texts_fixed_len,embeddings_vec_size,1))(embedding)
    concat = []
    for filter_size in config.FILTER_SIZES:
        conv_layer = Conv2D(config.NUM_FILTERS, 
                            kernel_size=(filter_size, embeddings_vec_size),
                            padding='valid', 
                            kernel_initializer='normal', 
                            activation='relu')(reshape)
        pooling_layer = MaxPool2D(pool_size=(texts_fixed_len - filter_size + 1, 1),
                                strides=(1,1),
                                padding='valid')(conv_layer)
        concat.append(pooling_layer)
    concatenate = Concatenate(axis=1)(concat)
    flatten = Flatten()(concatenate)
    dropout = Dropout(config.DROPOUT)(flatten)
    output = Dense(units=2, activation='softmax')(dropout)
    model = Model(inputs=inputs, outputs=output)
    adam = Adam(lr=config.LEARNING_RATE)
    model.compile(optimizer=adam, loss='categorical_crossentropy', metrics=['accuracy'])
    return model