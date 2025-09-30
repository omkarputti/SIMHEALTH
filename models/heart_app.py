from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model + feature columns (no scaler)
model, feature_columns = joblib.load("heart_model.pkl")

# Define required features (must match training)
required_features = feature_columns  # or manually list them if you want

@app.route("/predict_heart", methods=["POST"])
def predict_heart():
    try:
        data = request.json

        # Check for missing fields
        missing = [f for f in required_features if f not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {missing}"}), 400

        # Convert input to DataFrame
        df = pd.DataFrame([data])

        # One-hot encode categorical features
        df_encoded = pd.get_dummies(df)
        df_encoded = df_encoded.reindex(columns=feature_columns, fill_value=0)

        # Predict
        prediction = model.predict(df_encoded)[0]
        prob = model.predict_proba(df_encoded)[0][1]

        return jsonify({
            "prediction": int(prediction),
            "probability_heart_disease": float(prob)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
