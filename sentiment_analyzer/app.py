from flask import Flask, render_template, request
import joblib

app = Flask(__name__)
model = joblib.load('sentiment_model.pkl')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    text = request.form['user_input']
    prediction = model.predict([text])[0]
    return render_template('index.html', input=text, result=prediction)

if __name__ == '__main__':
    app.run(debug=True)
