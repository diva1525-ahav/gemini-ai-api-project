const chatContainer = document.getElementById('chat-container');
const promptInput = document.getElementById('prompt');
const sendBtn = document.getElementById('send-btn');

async function sendMessage() {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  appendMessage(prompt, 'user');
  promptInput.value = '';

  const loadingMsg = appendMessage('Thinking...', 'bot', true);

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    chatContainer.removeChild(loadingMsg);

    if (data.success && data.data) {
      appendMessage(data.data, 'bot');
    } else {
      appendMessage(`⚠️ Error: ${data.message}`, 'bot');
    }
  } catch (err) {
    chatContainer.removeChild(loadingMsg);
    appendMessage(`❌ Network error: ${err.message}`, 'bot');
  }
}

function appendMessage(text, sender, isLoading = false) {
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.textContent = text;
  if (isLoading) div.classList.add('loading');
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return div;
}

sendBtn.addEventListener('click', sendMessage);
promptInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});
