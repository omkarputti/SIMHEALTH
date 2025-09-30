from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

# Setup Flask
app = Flask(__name__)
CORS(app)

# Load trained diabetes model
model = joblib.load("diabetes_model.pkl")

# Default values for missing features
default_values = {
    "Pregnancies": 0,
    "Glucose": 120,
    "BloodPressure": 70,
    "SkinThickness": 20,
    "Insulin": 79,
    "BMI": 25.0,
    "DiabetesPedigreeFunction": 0.5,
    "Age": 30
}

# Feature order expected by the model
feature_order = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age"
]

@app.route("/predict_diabetes", methods=["POST"])
def predict_diabetes():
    try:
        data = request.json
        
        # Fill missing features with defaults
        features = [data.get(f, default_values[f]) for f in feature_order]
        features = np.array(features).reshape(1, -1)
        
        # Predict
        prediction = model.predict(features)[0]
        prob = model.predict_proba(features)[0][1]
        
        return jsonify({
            "prediction": int(prediction),
            "probability_diabetes": float(f"{prob:.2f}")
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
