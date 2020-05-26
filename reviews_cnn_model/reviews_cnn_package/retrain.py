from reviews_cnn_package.model import train_pipeline

result = train_pipeline.train_model(from_checkpoint=True)
print(result)