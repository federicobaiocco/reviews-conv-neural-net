from reviews_cnn_package.model import train_pipeline

if __name__ == 'main':
    result = train_pipeline.train_model()
    print(result)