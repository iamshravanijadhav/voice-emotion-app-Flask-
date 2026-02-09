let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.interimResults = false;

let recordingStartTime = null;
let sampleCounter = 0;
let emotionCounts = {
    Happy: 0,
    Sad: 0,
    Angry: 0,
    Excited: 0,
    Confused: 0,
    Scared: 0,
    Calm: 0,
    Surprised: 0,
    Neutral: 0
};
let isRecording = false;

recognition.onstart = function() {
    recordingStartTime = new Date();
    isRecording = true;
    console.log("Recording started...");
};

recognition.onresult = async function(event){
    let text = event.results[0][0].transcript;
    
    // Calculate duration
    let recordingEndTime = new Date();
    let durationMs = recordingEndTime - recordingStartTime;
    let durationSeconds = (durationMs / 1000).toFixed(1);

    document.getElementById("result").innerText = "📝 " + text;

    let res = await fetch("/analyze",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({text:text})
    });

    let data = await res.json();

    updateTable(text, data.emotion, recordingEndTime, durationSeconds);
};

recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
    document.getElementById("result").innerText = "❌ Error: " + event.error;
    isRecording = false;
};

recognition.onend = function() {
    isRecording = false;
    console.log("Recording ended.");
};

function startRecording(){
    if (!isRecording) {
        try {
            recognition.start();
        } catch(e) {
            console.error("Error starting recognition:", e);
            // If already started, just continue
            if (e.name !== 'InvalidStateError') {
                document.getElementById("result").innerText = "❌ " + e.message;
            }
        }
    }
}

function stopRecording(){
    if (isRecording) {
        recognition.stop();
    }
}

function updateTable(text, emotion, timestamp, duration){
    sampleCounter++;
    
    // Update emotion counts
    emotionCounts[emotion]++;
    
    // Update statistics
    updateStatistics();
    
    const tableBody = document.querySelector("#historyTable tbody");
    const emptyState = document.getElementById("emptyState");
    
    // Hide empty state
    if(emptyState) {
        emptyState.classList.remove('show');
    }

    let row = document.createElement("tr");
    
    // Format timestamp
    let timeString = timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    
    // Format date
    let dateString = timestamp.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
    
    // Create emotion badge class
    let emotionClass = 'emotion-' + emotion.toLowerCase();
    
    row.innerHTML = `
        <td>${sampleCounter}</td>
        <td class="timestamp">${dateString} ${timeString}</td>
        <td><span class="duration-badge">${duration}s</span></td>
        <td>${text}</td>
        <td><span class="emotion-badge ${emotionClass}">${emotion}</span></td>
    `;

    // Add to top of table (most recent first)
    tableBody.insertBefore(row, tableBody.firstChild);
    
    // Add subtle animation
    row.style.animation = 'fadeIn 0.5s ease';
}

function updateStatistics() {
    document.getElementById('totalSamples').textContent = sampleCounter;
    document.getElementById('happyCount').textContent = emotionCounts.Happy;
    document.getElementById('sadCount').textContent = emotionCounts.Sad;
    document.getElementById('angryCount').textContent = emotionCounts.Angry;
    document.getElementById('excitedCount').textContent = emotionCounts.Excited;
    document.getElementById('confusedCount').textContent = emotionCounts.Confused;
    document.getElementById('scaredCount').textContent = emotionCounts.Scared;
    document.getElementById('calmCount').textContent = emotionCounts.Calm;
    document.getElementById('surprisedCount').textContent = emotionCounts.Surprised;
    document.getElementById('neutralCount').textContent = emotionCounts.Neutral;
}

// Show empty state on page load
window.addEventListener('DOMContentLoaded', function() {
    const emptyState = document.getElementById('emptyState');
    if(emptyState && sampleCounter === 0) {
        emptyState.classList.add('show');
    }
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Upload Audio Function - WORKING VERSION
async function uploadAudio() {
    let fileInput = document.getElementById("fileInput");
    
    if (fileInput.files.length === 0) {
        alert("Please select an audio file first!");
        return;
    }
    
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('audio', file);
    
    // Show loading message
    document.getElementById("result").innerText = "⏳ Uploading and analyzing...";
    
    try {
        let response = await fetch("/upload", {
            method: "POST",
            body: formData
        });
        
        let data = await response.json();
        
        if (response.ok) {
            // For now, since audio-to-text is not implemented yet
            // We'll show a success message
            document.getElementById("result").innerText = "✅ File uploaded: " + data.filename;
            
            // You can uncomment this when audio transcription is working
            // let recordingTime = new Date();
            // updateTable(data.text, data.emotion, recordingTime, "N/A");
            
            alert("Audio file uploaded successfully!\n\nNote: Audio-to-text transcription will be added in the next update.");
        } else {
            document.getElementById("result").innerText = "❌ Error: " + data.error;
            alert("Upload failed: " + data.error);
        }
    } catch (error) {
        console.error("Upload error:", error);
        document.getElementById("result").innerText = "❌ Upload failed!";
        alert("Upload failed: " + error.message);
    }
    
    // Clear file input
    fileInput.value = "";
    document.getElementById("fileName").textContent = "";
}

// Display selected file name
function displayFileName() {
    let fileInput = document.getElementById("fileInput");
    let fileNameDisplay = document.getElementById("fileName");
    
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = "Selected: " + fileInput.files[0].name;
    } else {
        fileNameDisplay.textContent = "";
    }
}