import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib

# Sample dataset
data = pd.DataFrame({
    'text': [
        "I love this product", "This is the best thing ever",
        "I hate this", "It's terrible", "Absolutely amazing",
        "Not great", "I don't like it", "Very good", "Awful experience", "Meh"
    ],
    'label': [
        'positive', 'positive',
        'negative', 'negative', 'positive',
        'negative', 'negative', 'positive', 'negative', 'neutral'
    ]
})

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(data['text'], data['label'], test_size=0.2)

# Create model pipeline
model = Pipeline([
    ('vectorizer', CountVectorizer()),
    ('classifier', MultinomialNB())
])

model.fit(X_train, y_train)

# Save model
joblib.dump(model, 'sentiment_model.pkl')

print("Model trained and saved as sentiment_model.pkl")
