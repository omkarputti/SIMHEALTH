# train_diabetes_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib

# 1. Load dataset
data = pd.read_csv("diabetes.csv")  # download from Kaggle

# 2. Features and labels
X = data.drop("Outcome", axis=1)  # features
y = data["Outcome"]  # labels (0/1)

# 3. Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Train Logistic Regression
model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

# 5. Evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# 6. Save model
joblib.dump(model, "diabetes_model.pkl")
print("Model saved as diabetes_model.pkl")
