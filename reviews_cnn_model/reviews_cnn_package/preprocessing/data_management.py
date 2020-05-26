from gensim.models import KeyedVectors
from reviews_cnn_package.config import config
import numpy as np

def load_embeddings(word_index):
    '''
    Load pretrained word embeddings (.kv) from wvec_path and generate an embedding matrix according word_index.
    Returns:
     - embedding_matrix: word embeddings matrix. It will have the shape (len(word_index) + 1, embeddings_vec_size).
     - embeddings_vec_size: embedding vector´s size
    '''
    wvecs = KeyedVectors.load(config.WVEC_PATH, mmap='r')
    embeddings_vec_size = wvecs.vector_size
    embedding_matrix = np.zeros((len(word_index) + 1, embeddings_vec_size))
    for word, i in word_index.items():
        try:
            embedding_vector = wvecs.get_vector(word)
            if embedding_vector is not None:
                embedding_matrix[i] = embedding_vector
        except:
            pass # words that are not found in embeddings are filled with all 0
    return embedding_matrix, embeddings_vec_size