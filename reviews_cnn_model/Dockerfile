FROM python:3.6.7

WORKDIR /usr/src/api
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . .
ADD https://zenodo.org/record/1410403/files/keyed_vectors.zip?download=1 reviews_cnn_package/word_embeddings/
RUN apt-get update && apt-get install unzip && unzip reviews_cnn_package/word_embeddings/* -d reviews_cnn_package/word_embeddings/
RUN python -m spacy download es_core_news_sm
RUN python train.py