// This script handles the chat functionality, including sending and receiving messages, playing sounds, and displaying notifications.
// It uses Socket.IO for real-time communication and includes a simple UI for the chat interface.
const socket = io();
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const messageContainer = document.getElementById('messageContainer');

const senderAvatar = 'https://api.dicebear.com/7.x/adventurer/svg?seed=You';
const receiverAvatar = 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bot';

const messageSound = new Audio('/music.mp3');
const responderSound = new Audio('/responder.mp3');

let lastSentMessage = '';

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

sendButton.addEventListener('click', () => {
  const message = userInput.value.trim();
  if (message !== '') {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    lastSentMessage = message;
    appendMessage(message, 'sender', timestamp);
    socket.emit('chat message', message);
    userInput.value = '';
    messageSound.currentTime = 0;
    messageSound.play();
  }
});

socket.on('chat message', (msg) => {
  if (msg === lastSentMessage) {
    lastSentMessage = '';
    return;
  }
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  appendMessage(msg, 'receiver', timestamp);
  responderSound.currentTime = 0;
  responderSound.play();
  if (Notification.permission === "granted" && document.hidden) {
    new Notification("📩 New Message", {
      body: msg,
      icon: "/ico.png"
    });
  }
});

function appendMessage(text, role, time) {
  const messageEl = document.createElement('div');
  messageEl.className = `flex items-end ${role === 'sender' ? 'justify-end' : 'justify-start'}`;
  messageEl.innerHTML = `
    ${role === 'receiver' ? `<img src="${receiverAvatar}" class="w-8 h-8 rounded-full mr-2">` : ''}
    <div class="max-w-xs px-4 py-2 rounded-lg shadow 
      ${role === 'sender' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-600 text-white rounded-bl-none'}">
      <p class="break-words">${text}</p>
      <p class="text-xs text-right mt-1 opacity-70">${time}</p>
    </div>
    ${role === 'sender' ? `<img src="${senderAvatar}" class="w-8 h-8 rounded-full ml-2">` : ''}
  `;
  messageContainer.appendChild(messageEl);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
