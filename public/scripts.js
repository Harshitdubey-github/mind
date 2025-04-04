import Vapi from "@vapi-ai/web";
import { VAPI_SHARE_KEY, VAPI_ASSISTANT_ID } from './config.js';

// --- DOM Elements ---
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const muteButton = document.getElementById('muteButton');
const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const statusArea = document.getElementById('statusArea');
const voiceStatus = document.getElementById('voiceStatus');

// --- State ---
let vapi = null;
let isCallActive = false;
let isMutedState = false;

// --- Helper Functions ---
function logStatus(message) {
    console.log("LogStatus:", message);
    const timestamp = new Date().toLocaleTimeString();
    
    // Log to hidden status area for debugging
    statusArea.textContent += `\n[${timestamp}] ${message}`;
    statusArea.scrollTop = statusArea.scrollHeight;
    
    // Update the visible status message
    updateVisibleStatus(message);
}

function updateVisibleStatus(message) {
    // Filter out technical messages and show user-friendly messages
    if (message.includes("Error:")) {
        voiceStatus.textContent = message;
        voiceStatus.style.color = "#ff6584";
    } else if (message.includes("Call started successfully")) {
        voiceStatus.textContent = "Connected! You can speak now.";
        voiceStatus.style.color = "#43cea2";
    } else if (message.includes("Call ended")) {
        voiceStatus.textContent = "Session ended. Tap the mic to start again.";
        voiceStatus.style.color = "#999";
    } else if (message.includes("Warning:")) {
        voiceStatus.textContent = message;
        voiceStatus.style.color = "#ffa500";
    } else {
        // Update status for other messages
        voiceStatus.textContent = message;
        voiceStatus.style.color = "#999";
    }
}

function updateButtonStates() {
    // Handle mic button appearance
    if (isCallActive) {
        startButton.style.backgroundColor = "#43cea2"; // Change color when active
        startButton.querySelector('i').classList.remove('fa-microphone');
        startButton.querySelector('i').classList.add('fa-headset');
    } else {
        startButton.style.backgroundColor = ""; // Reset to default var(--primary)
        startButton.querySelector('i').classList.remove('fa-headset');
        startButton.querySelector('i').classList.add('fa-microphone');
    }
    
    // Update original controls for functionality
    stopButton.disabled = !isCallActive;
    muteButton.disabled = !isCallActive;
    sendButton.disabled = !isCallActive;
    messageInput.disabled = !isCallActive;

    if (isCallActive) {
        muteButton.textContent = isMutedState ? 'Unmute' : 'Mute';
        muteButton.classList.toggle('muted', isMutedState);
    } else {
         muteButton.textContent = 'Mute';
         muteButton.classList.remove('muted');
         messageInput.value = ''; // Clear message input when call ends
    }
}

// --- Event Handlers ---
function handleStartCall() {
    console.log(">>> handleStartCall function entered <<<");
    
    // If already in a call, stop it
    if (isCallActive && vapi) {
        handleStopCall();
        return;
    }

    const publicKey = VAPI_SHARE_KEY;
    const assistantId = VAPI_ASSISTANT_ID;

    console.log("Public Key:", publicKey);
    console.log("Assistant ID:", assistantId);

    if (!publicKey || !assistantId) {
        console.log(">>> Validation FAILED: Missing key or ID in config.js <<<");
        logStatus("Error: Missing Public Key or Assistant ID in configuration.");
        return;
    }

    if (vapi) {
        console.log(">>> Warning: Vapi instance already exists <<<");
        logStatus("Warning: Vapi instance already exists. Please stop the previous call first or refresh.");
        return;
    }

    logStatus("Initializing your coach...");
    try {
        console.log(">>> Creating Vapi instance <<<");
        vapi = new Vapi(publicKey);
        console.log(">>> Vapi instance created <<<");
    } catch (err) {
        console.error(">>> ERROR creating Vapi instance:", err);
        logStatus(`Error: Could not initialize voice service. ${err.message}`);
        return;
    }

    logStatus("Connecting to your AI coach...");
    isCallActive = true;
    updateButtonStates();

    // --- Vapi Event Listeners ---
    vapi.on("call-start", () => {
        console.log(">>> Vapi Event: call-start <<<");
        logStatus("Your coach is ready to help you.");
        isCallActive = true;
        isMutedState = vapi.isMuted();
        updateButtonStates();
    });

    vapi.on("call-end", () => {
        console.log(">>> Vapi Event: call-end <<<");
        logStatus("Coaching session ended.");
        isCallActive = false;
        isMutedState = false;
        vapi = null;
        updateButtonStates();
    });

    vapi.on("error", (error) => {
        console.error(">>> Vapi Event: error <<<", error);
        logStatus(`Error: ${error.message || "Something went wrong"}`);
        console.error("Vapi Error:", error);
        isCallActive = false;
        isMutedState = false;
        vapi = null;
        updateButtonStates();
    });

    // --- Start the call ---
    console.log(">>> Calling vapi.start()... <<<");
    vapi.start(assistantId)
        .then(callInfo => {
             console.log(">>> vapi.start() promise RESOLVED <<<", callInfo);
             logStatus(`You're connected with your AI coach.`);
        })
        .catch(error => {
            console.error(">>> vapi.start() promise REJECTED <<<", error);
            logStatus(`Error: Could not connect to your coach. ${error.message || ""}`);
            console.error("Start Call Error:", error);
            isCallActive = false;
            vapi = null;
            updateButtonStates();
        });

    console.log(">>> handleStartCall function finished executing synchronous code <<<");
}

function handleStopCall() {
    if (!vapi || !isCallActive) {
        logStatus("No active session to end.");
        return;
    }
    logStatus("Ending your coaching session...");
    vapi.stop();
    // The "call-end" event will handle the state updates
}

function handleMuteToggle() {
    if (!vapi || !isCallActive) return;

    isMutedState = !isMutedState;
    vapi.setMuted(isMutedState);
    logStatus(`Microphone ${isMutedState ? 'muted' : 'unmuted'}.`);
    updateButtonStates();
}

function handleSendMessage() {
     if (!vapi || !isCallActive) return;

     const content = messageInput.value.trim();
     if (!content) {
         logStatus("Please enter a message to send.");
         return;
     }

     const message = {
         type: "add-message",
         message: {
             role: "system",
             content: content,
         },
     };

     logStatus(`Sending message to your coach...`);
     vapi.send(message);
     messageInput.value = ''; // Clear input after sending
}

// --- Attach Event Listeners to Buttons ---
startButton.addEventListener('click', handleStartCall);
stopButton.addEventListener('click', handleStopCall);
muteButton.addEventListener('click', handleMuteToggle);
sendButton.addEventListener('click', handleSendMessage);

// Add listener for Enter key in message input
messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !sendButton.disabled) {
        handleSendMessage();
    }
});

// --- Initial Setup ---
updateButtonStates();
logStatus("Ready to connect to your AI coach. Tap the mic to start.");