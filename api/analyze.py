from http.server import BaseHTTPRequestHandler
import json
import speech_recognition as sr
from transformers import pipeline
import cgi

# Load emotion model
emotion_model = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base"
)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST'}
        )

        fileitem = form['audio']

        # Save audio temporarily
        with open("/tmp/audio.wav", "wb") as f:
            f.write(fileitem.file.read())

        # Speech to text
        r = sr.Recognizer()
        with sr.AudioFile("/tmp/audio.wav") as source:
            audio = r.record(source)

        text = r.recognize_google(audio)

        # Emotion detection
        result = emotion_model(text)[0]

        response = {
            "text": text,
            "emotion": result['label']
        }

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        self.wfile.write(json.dumps(response).encode())
