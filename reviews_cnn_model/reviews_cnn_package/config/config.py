import os

#GLOBAL VALUES
TEST_SPLIT = 0.15
FILTER_SIZES = [2,3,4]
NUM_FILTERS = 512
DROPOUT = 0.5 #dropout
BATCH_SIZE = 32
EPOCHS = 10
LEARNING_RATE = 1e-4
EARLY_STOPPING_PATIENCE = 2

#STOP WORDS
insurance_company_names = ['falabella','sura','rivadavia','allianz','hdi','pelayo','verti','ocaso','iati','meridional','sancor','prudential','patagonia']
transform_dict = {
    'k':'que',
    'q':'que',
    'xq': 'por que',
    'wsp':'whatsapp',
    'wasap':'whatsapp',
    'watsap':'whatsapp',
    'hdp': 'hijo de puta',
    'vergüenza' : 'verguenza',
    'imbesil': 'imbecil',
    'imbesiles': 'imbeciles'
}
non_important_words = ['seguro','seguros', 'hola', 'whatsapp','banco','auto','moto','vehiculo']

#PWD = os.path.dirname(os.path.abspath(__file__))
#PACKAGE_ROOT = os.path.abspath(os.path.join(PWD, '..'))
PWD = os.path.dirname(os.path.abspath(__file__))
PACKAGE_ROOT = os.path.abspath(os.path.join(PWD, '..'))
DATASET_DIR = os.path.join(PACKAGE_ROOT, 'datasets')
TRAINED_MODEL_DIR = os.path.join(PACKAGE_ROOT,'trained_models')

#WORD EMBEDDINGS
WVEC_FILE_NAME = 'complete.kv'
WVEC_PATH = os.path.join(PACKAGE_ROOT, 'word_embeddings', WVEC_FILE_NAME)

# MODEL PERSISTING
MODEL_NAME = 'reviews_cnn'
PIPELINE_NAME = 'reviews_cnn_pipeline'
TOKENIZER_NAME = 'text_tokenizer'
TEXT_PROCESSOR_NAME = 'text_processor'

with open(os.path.join(PACKAGE_ROOT, 'model', 'VERSION')) as version_file:
    _version = version_file.read().strip()

MODEL_FILE_NAME = f'{MODEL_NAME}_{_version}.h5'
MODEL_PATH = os.path.join(TRAINED_MODEL_DIR, MODEL_FILE_NAME)

TOKENIZER_FILE_NAME = f'{TOKENIZER_NAME}_{_version}.pkl'
TOKENIZER_PATH = os.path.join(TRAINED_MODEL_DIR, TOKENIZER_FILE_NAME)

TEXT_PROCESSOR_FILE_NAME = f'{TEXT_PROCESSOR_NAME}_{_version}.pkl'
TEXT_PROCESSOR_PATH = os.path.join(TRAINED_MODEL_DIR, TEXT_PROCESSOR_FILE_NAME)

MODEL_VERSION = _version