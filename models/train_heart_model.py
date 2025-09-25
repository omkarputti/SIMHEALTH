import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# 1. Load dataset
data = pd.read_csv("heart.csv")

# 2. Handle categorical columns (convert to numbers)
data_encoded = pd.get_dummies(data, drop_first=True)

# 3. Features and target
X = data_encoded.drop("HeartDisease", axis=1)
y = data_encoded["HeartDisease"]

# 4. Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Train model
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# 6. Evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# 7. Save model and column names (important for inference)
joblib.dump((model, list(X.columns)), "heart_model.pkl")
print("Model saved as heart_model.pkl")
