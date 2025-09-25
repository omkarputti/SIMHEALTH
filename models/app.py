from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow cross-origin

# Load model
model = joblib.load("diabetes_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json  # input must be JSON
    # Expecting features in correct order
    try:
        features = [
            data["Pregnancies"],
            data["Glucose"],
            data["BloodPressure"],
            data["SkinThickness"],
            data["Insulin"],
            data["BMI"],
            data["DiabetesPedigreeFunction"],
            data["Age"]
        ]
        features = np.array(features).reshape(1, -1)
        prediction = model.predict(features)[0]
        prob = model.predict_proba(features)[0][1]
        return jsonify({
            "prediction": int(prediction),
            "probability_diabetes": float(prob)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
