from flask import Flask, render_template, request, jsonify
import speech_recognition as sr
from transformers import pipeline

app = Flask(__name__)

# To Load emotion model once
emotion_model = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base"
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    file = request.files["audio"]
    file.save("temp.wav")

    # For Speech to text
    r = sr.Recognizer()
    with sr.AudioFile("temp.wav") as source:
        audio = r.record(source)

    text = r.recognize_google(audio)

    # For Emotion detection
    result = emotion_model(text)[0]

    return jsonify({
        "text": text,
        "emotion": result["label"]
    })

if __name__ == "__main__":
    app.run()
