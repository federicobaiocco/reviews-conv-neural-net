FROM python:3.6.7

WORKDIR /usr/src/api
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . .
ADD https://zenodo.org/record/1410403/files/keyed_vectors.zip?download=1 /reviews_cnn_model/word_embeddings/
#RUN mv /reviews_cnn_model/word_embeddings/keyed_vectors/* /reviews_cnn_model/word_embeddings/
RUN python train.py