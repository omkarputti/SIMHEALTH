from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from googletrans import Translator
import os
import difflib

# ------------------- Setup -------------------
translator = Translator()
genai.configure(api_key="AIzaSyAGW6HrXWvqRp9zwRkFvpTKvXv9OGMJWx8")

# ------------------- System Instruction -------------------
simhealth_instruction = """
You are SIMHEALTH Assistant, a friendly healthcare helper.

Your style:
- Always reply in short, clear bullet points (no long paragraphs).
- Use simple, easy-to-understand language.
- Be supportive but concise.
- Avoid using too many symbols like asterisks (*) or markdown.
- For health queries: give step-by-step basic guidance.
- For SIMHEALTH app queries: explain features and navigation simply.
- Limit answers to 4-5 bullet points maximum.
- Always remind users that for serious problems, they should consult a doctor.
"""

model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=simhealth_instruction)

MEMORY_FILE = "simhealth_memory.txt"

if os.path.exists(MEMORY_FILE):
    with open(MEMORY_FILE, "r", encoding="utf-8") as f:
        past_history = f.read()
else:
    past_history = ""

chat = model.start_chat(history=[{"role": "user", "parts": [past_history]}] if past_history else [])

# ------------------- FAQ Dictionary -------------------
FAQS = {
    "how do i upload my report": 
        "- Open the SIMHEALTH app\n- Go to 'Upload Report'\n- Select your file\n- Wait for secure processing",
    
    "where can i see my results": 
        "- Go to 'My Reports' on the dashboard\n- You’ll see patient-friendly and detailed clinical views\n- Emergency alerts show if needed",
    
    "how to book an appointment": 
        "- SIMHEALTH is for screening only\n- Use your hospital’s booking system for appointments",
    
    "what diseases are screened": 
        "- Heart disease\n- Diabetes\n- Tuberculosis\n- Pneumonia\n- COPD",
    
    "is my data safe": 
        "- Yes, all data is encrypted (AES + RSA)\n- Reports are secured with blockchain\n- Only you and authorized doctors can view",
    
    "how do i use the app": 
        "- Visit https://simhealth.vercel.app/\n- Sign up or log in\n- Enter details or upload reports\n- View results in 'My Reports'\n- Follow chatbot guidance if needed"
}

# ------------------- Default App Guide -------------------
DEFAULT_APP_GUIDE = (
    "- Go to https://simhealth.vercel.app/\n"
    "- Sign up or log in\n"
    "- Upload your health report or enter details\n"
    "- Check 'My Reports' for results\n"
    "- Both patient-friendly and clinical views are available"
)

# ------------------- Flask App -------------------
app = Flask(__name__)
CORS(app)

@app.route("/api/chat", methods=["POST"])
def chat_with_helper():
    data = request.get_json()
    user_input = data.get("message", "").strip()
    reply_lang = data.get("lang", "en")

    if not user_input:
        return jsonify({"error": "Empty message"}), 400

    # Normalize input for FAQ matching
    user_lower = user_input.lower()

    # Try fuzzy match with FAQ keys
    possible_matches = difflib.get_close_matches(user_lower, FAQS.keys(), n=1, cutoff=0.6)
    if possible_matches:
        reply_en = FAQS[possible_matches[0]]
    elif any(word in user_lower for word in ["app", "simhealth", "report", "result", "upload", "dashboard"]):
        # If looks app-related but no FAQ match → give default guide
        reply_en = DEFAULT_APP_GUIDE
    else:
        # Otherwise → send to Gemini (health/general queries)
        user_input_en = translator.translate(user_input, dest="en").text
        response = chat.send_message(user_input_en)
        reply_en = response.text.strip()

    # Translate back if needed
    if reply_lang != "en":
        reply = translator.translate(reply_en, src="en", dest=reply_lang).text
    else:
        reply = reply_en

    # Save memory
    with open(MEMORY_FILE, "a", encoding="utf-8") as f:
        f.write(f"User: {user_input}\nHelperBot: {reply}\n\n")

    return jsonify({"reply": reply})

# ------------------- Run -------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
