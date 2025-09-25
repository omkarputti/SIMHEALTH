from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS
import google.generativeai as genai

# Setup Flask
app = Flask(__name__)
CORS(app)

# Load model + feature columns
model, feature_columns = joblib.load("heart_model.pkl")

# Configure Gemini API (replace with your key)
genai.configure(api_key="AIzaSyDY76dS72BXfW3imdjcYXm3jH_vs10zAZ8")

@app.route("/predict_heart", methods=["POST"])
def predict_heart():
    try:
        data = request.json  # incoming JSON
        
        # Convert to DataFrame for easier preprocessing
        df = pd.DataFrame([data])
        
        # One-hot encode categorical features
        df_encoded = pd.get_dummies(df)
        
        # Align columns with training
        df_encoded = df_encoded.reindex(columns=feature_columns, fill_value=0)
        
        # Predict
        prediction = model.predict(df_encoded)[0]
        prob = model.predict_proba(df_encoded)[0][1]
        
        if prediction == 1:
            # Ask Gemini for explanation
            prompt = f"""
            A patient has heart disease with probability {prob:.2f}.
            Their input data is: {data}.
            Based on this, explain what type of heart disease this might be 
            (e.g., coronary artery disease, arrhythmia, etc.) and why.
            Keep the explanation simple and clinical.
            """
            response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
            explanation = response.text
        else:
            explanation = "No signs of heart disease detected."
        
        return jsonify({
            "prediction": int(prediction),
            "probability_heart_disease": float(prob),
            "gemini_explanation": explanation
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
