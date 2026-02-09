from flask import Flask, render_template, request, jsonify
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'ogg', 'm4a', 'webm'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    text = request.json["text"].lower()
    
    # Enhanced emotion detection with more categories
    if any(word in text for word in ["happy", "great", "wonderful", "excellent", "fantastic", "amazing", "good", "joyful", "cheerful", "delighted"]):
        emotion = "Happy"
    elif any(word in text for word in ["sad", "unhappy", "depressed", "terrible", "awful", "horrible", "miserable", "down"]):
        emotion = "Sad"
    elif any(word in text for word in ["angry", "mad", "furious", "annoyed", "irritated", "frustrated", "hate"]):
        emotion = "Angry"
    elif any(word in text for word in ["excited", "thrilled", "pumped", "enthusiastic", "eager", "energetic"]):
        emotion = "Excited"
    elif any(word in text for word in ["confused", "puzzled", "perplexed", "bewildered", "uncertain", "lost"]):
        emotion = "Confused"
    elif any(word in text for word in ["scared", "afraid", "frightened", "terrified", "fear", "worried", "anxious"]):
        emotion = "Scared"
    elif any(word in text for word in ["calm", "peaceful", "relaxed", "serene", "tranquil"]):
        emotion = "Calm"
    elif any(word in text for word in ["surprised", "shocked", "amazed", "astonished", "startled"]):
        emotion = "Surprised"
    else:
        emotion = "Neutral"

    return jsonify({"emotion": emotion})


@app.route("/upload", methods=["POST"])
def upload_file():
    if 'audio' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['audio']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # For now, return a placeholder response
        # You can add actual audio-to-text conversion here using libraries like:
        # - SpeechRecognition
        # - Google Cloud Speech-to-Text
        # - AssemblyAI
        
        return jsonify({
            "message": "File uploaded successfully",
            "filename": filename,
            "text": "Audio transcription coming soon!",
            "emotion": "Neutral"
        })
    
    return jsonify({"error": "Invalid file type"}), 400


if __name__ == "__main__":
    app.run(debug=True)