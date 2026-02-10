# 🎤 Voice Emotion Analyzer (Flask Web App)

A simple AI-based web application that analyzes voice input and detects the **emotion/sentiment** of the speaker.

This project is built using **Flask (Python backend)** and the **JavaScript Speech Recognition API** to process voice input and display emotions on a dashboard.

---

## 🌍 Live Demo

👉 https://voice-emotion-app-flask.onrender.com/

---

## 🚀 Features

- 🎙️ Record voice and analyze emotion
- 📁 Upload audio file for analysis
- 😊 Detect emotions like Happy, Sad, Angry, Calm, etc.
- 📊 Dashboard table showing emotion history
- ⏱️ Displays timestamp and duration of each sample
- 🌐 Deployed on Render
- ⚡ Fast and lightweight (no heavy AI models)

---

## ▶️ How to Use

### 🎤 Voice Recording

1. Click **Start Recording**
2. Speak clearly into your microphone
3. Click **Stop Recording** when finished
4. The app will:
   - Convert your voice to text
   - Detect the emotion
   - Add the result to the dashboard

👉 **Important:**  
Click **Start** to begin recording and **Stop** when you are finished to know your expression/emotion.

---

## 🛠️ Tech Stack

- **Flask (Python)** – Backend server & API handling
- JavaScript Speech Recognition API – Voice to text conversion
- HTML & CSS – UI/UX
- Gunicorn – Production server
- Render – Deployment platform

---

## 📂 Project Structure

```
voice-emotion-app/
│
├── app.py
├── requirements.txt
├── render.yaml
│
├── templates/
│   └── index.html
│
├── static/
│   ├── script.js
│   └── style.css
│
└── uploads/
```

