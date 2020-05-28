import pandas as pd
import numpy as np
import re
import spacy
from reviews_cnn_package.config import config
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
import os
import unicodedata

class TextPreprocessor():
    
    def __init__(self, test_split, pad_with = 'max_len'):
        '''
        Pad with can be: 'max_lenght', 'avg_lenght' or int number
        ''' 
        if (pad_with not in ('max_len','avg_len')) and (type(pad_with) is not int):
            raise Exception("ERROR: Pad with must be 'max_lenght', 'avg_lenght' or int type")
        self.tokenizer = Tokenizer()
        self.test_split = test_split
        self.pad_with = pad_with
        self.pad_text_to = None
        self.nlp = spacy.load('es_core_news_sm', disable=['ner','parser'])
    
    def fit_transform(self):
        # Data Preparation
        x_text, y = self.make_dataset()

        # Build vocabulary
        if self.pad_with == 'max_len':
            max_text_lenght = max([len(x.split(" ")) for x in x_text])
            self.pad_text_to = max_text_lenght
        elif self.pad_with == 'avg_len':
            avg_text_lenght = int(np.mean([len(x.split(" ")) for x in x_text]))
            self.pad_text_to = avg_text_lenght
        elif type(self.pad_with) is int:
            self.pad_text_to = self.pad_with
        else:
            raise Exception("ERROR: Pad with must be 'max_lenght', 'avg_lenght' or int type")
        
        self.tokenizer.fit_on_texts(x_text)
        sequences =  self.tokenizer.texts_to_sequences(x_text)
        word_index = self.tokenizer.word_index
        vocab_size = len(word_index) + 1
        print("Vocabulary Size : {}".format(vocab_size))
        x = pad_sequences(sequences, maxlen=self.pad_text_to) # Pad with 0.0 (default pad_sequences value)

        # Shuffle data
        np.random.seed(10)
        shuffle_indices = np.random.permutation(np.arange(len(y)))
        x_shuffled = x[shuffle_indices]
        y_shuffled = y[shuffle_indices]

        # Split train/test set
        test_sample_index = -1 * int(self.test_split * float(len(y)))
        x_train, x_test = x_shuffled[:test_sample_index], x_shuffled[test_sample_index:]
        y_train, y_test = y_shuffled[:test_sample_index], y_shuffled[test_sample_index:]

        del x, y, x_shuffled, y_shuffled

        print("Train/Test split: {:d}/{:d}".format(len(y_train), len(y_test)))
        return x_train, y_train, vocab_size, word_index, x_test, y_test
   
    def transform(self, text):
        stripped = [s.strip() for s in text]
        clean = [self.clean_str(sent) for sent in stripped]
        sequences = self.tokenizer.texts_to_sequences(clean)
        x = pad_sequences(sequences, maxlen=self.pad_text_to)
        return x
    
    def get_padded_text_len(self):
        if self.pad_text_to is not None:
            return self.pad_text_to
        else:
            raise Exception("ERROR: pad_text_to is not set. Must fit before get_padded_text_len")
        
    def clean_str(self,string):
        string = re.sub(r"[^A-Za-z0-9(),!?\'\`]", " ", string)
        string = re.sub(r",", " , ", string)
        string = re.sub(r"!", " ! ", string)
        string = re.sub(r"\(", " \( ", string)
        string = re.sub(r"\)", " \) ", string)
        string = re.sub(r"\?", " \? ", string)
        string = re.sub(r"\s{2,}", " ", string) #2 spaces
        string = self.strip_accents(string)
        #replace words according the transform_dict
        string = ''.join(config.transform_dict[w.lower()] if w.lower() in config.transform_dict else w for w in re.split(r'(\W+)', string))
        #remove insurance company names and non important words
        stop_words = config.insurance_company_names + config.non_important_words
        string = ''.join(w.lower() if w.lower() not in stop_words else '' for w in re.split(r'(\W+)', string))
        
        doc = self.nlp(string)
        string = ' '.join([token.lemma_ for token in doc])
        
        return string.strip().lower()
    
    def strip_accents(self, text):

        try:
            text = unicode(text, 'utf-8')
        except NameError: # unicode is a default on python 3 
            pass
        text = unicodedata.normalize('NFD', text)\
               .encode('ascii', 'ignore')\
               .decode("utf-8")
        return str(text)

    def make_dataset(self):
        approved_dataframe = pd.read_csv(os.path.join(config.DATASET_DIR, 'all_approved.csv'))
        disapproved_dataframe = pd.read_csv(os.path.join(config.DATASET_DIR, 'all_disapproved.csv'))

        # Load data from files
        approved_examples = approved_dataframe['text'].values
        approved_examples = [s.strip() for s in approved_examples]

        disapproved_examples = disapproved_dataframe['text'].values
        disapproved_examples = [s.strip() for s in disapproved_examples]
       
        x_text = approved_examples + disapproved_examples
        x_text = [self.clean_str(sent) for sent in x_text]
        # labels
        approved_labels = [[0, 1] for _ in approved_examples]
        disapproved_labels = [[1, 0] for _ in disapproved_examples]
        y = np.concatenate([approved_labels, disapproved_labels], 0)
        return [x_text, y]