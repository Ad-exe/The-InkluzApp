import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.ensemble import RandomForestClassifier

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "alphabet.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "gesture_clf.pkl")
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

df = pd.read_csv(CSV_PATH)

X = df.drop(columns=["label"])
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

clf = RandomForestClassifier(
    n_estimators=400,
    random_state=42,
    class_weight="balanced",
    n_jobs=-1
)
clf.fit(X_train, y_train)

pred = clf.predict(X_test)
print("Accuracy:", accuracy_score(y_test, pred))
print(classification_report(y_test, pred))

joblib.dump(clf, MODEL_PATH)
print("Saved:", MODEL_PATH)
