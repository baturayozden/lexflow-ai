(function() {
  var slug = document.currentScript.getAttribute('data-slug');
  var primaryColor = document.currentScript.getAttribute('data-color') || '#c9a84c';
  var firmName = document.currentScript.getAttribute('data-firm') || 'us';
  if (!slug) return;

  var messages = [];
  var isOpen = false;
  var isLoading = false;

  var style = document.createElement('style');
  style.textContent = '\
    .lf-chat-btn {\
      position: fixed;\
      right: 24px;\
      bottom: 24px;\
      width: 56px;\
      height: 56px;\
      border-radius: 50%;\
      background: ' + primaryColor + ';\
      border: none;\
      cursor: pointer;\
      box-shadow: 0 4px 24px rgba(0,0,0,0.3);\
      z-index: 999998;\
      display: flex;\
      align-items: center;\
      justify-content: center;\
      font-size: 24px;\
      transition: transform 0.2s;\
    }\
    .lf-chat-btn:hover { transform: scale(1.1); }\
    .lf-chat-window {\
      position: fixed;\
      right: 24px;\
      bottom: 90px;\
      width: 360px;\
      max-height: 500px;\
      background: #0a1628;\
      border-radius: 16px;\
      border: 1px solid rgba(255,255,255,0.1);\
      box-shadow: 0 8px 48px rgba(0,0,0,0.4);\
      z-index: 999998;\
      display: none;\
      flex-direction: column;\
      font-family: "Helvetica Neue", Arial, sans-serif;\
      overflow: hidden;\
    }\
    .lf-chat-window.open { display: flex; }\
    .lf-chat-header {\
      padding: 16px 20px;\
      border-bottom: 1px solid rgba(255,255,255,0.08);\
      display: flex;\
      align-items: center;\
      gap: 10px;\
    }\
    .lf-chat-avatar {\
      width: 32px;\
      height: 32px;\
      border-radius: 50%;\
      background: ' + primaryColor + '20;\
      border: 2px solid ' + primaryColor + '40;\
      display: flex;\
      align-items: center;\
      justify-content: center;\
      font-size: 14px;\
    }\
    .lf-chat-title { color: white; font-weight: 600; font-size: 14px; }\
    .lf-chat-subtitle { color: rgba(255,255,255,0.4); font-size: 11px; }\
    .lf-chat-messages {\
      flex: 1;\
      overflow-y: auto;\
      padding: 16px;\
      display: flex;\
      flex-direction: column;\
      gap: 10px;\
    }\
    .lf-msg {\
      max-width: 85%;\
      padding: 10px 14px;\
      border-radius: 12px;\
      font-size: 13px;\
      line-height: 1.5;\
    }\
    .lf-msg-bot {\
      background: rgba(255,255,255,0.05);\
      color: rgba(255,255,255,0.85);\
      border-bottom-left-radius: 4px;\
      align-self: flex-start;\
    }\
    .lf-msg-user {\
      background: ' + primaryColor + '20;\
      color: rgba(255,255,255,0.85);\
      border: 1px solid ' + primaryColor + '30;\
      border-bottom-right-radius: 4px;\
      align-self: flex-end;\
    }\
    .lf-typing {\
      display: flex;\
      gap: 4px;\
      padding: 10px 14px;\
      background: rgba(255,255,255,0.05);\
      border-radius: 12px;\
      border-bottom-left-radius: 4px;\
      align-self: flex-start;\
    }\
    .lf-typing span {\
      width: 6px; height: 6px;\
      background: rgba(255,255,255,0.3);\
      border-radius: 50%;\
      animation: lf-bounce 1.2s infinite;\
    }\
    .lf-typing span:nth-child(2) { animation-delay: 0.2s; }\
    .lf-typing span:nth-child(3) { animation-delay: 0.4s; }\
    @keyframes lf-bounce {\
      0%, 60%, 100% { transform: translateY(0); }\
      30% { transform: translateY(-6px); }\
    }\
    .lf-chat-input-area {\
      padding: 12px 16px;\
      border-top: 1px solid rgba(255,255,255,0.08);\
      display: flex;\
      gap: 8px;\
    }\
    .lf-chat-input {\
      flex: 1;\
      background: rgba(255,255,255,0.05);\
      border: 1px solid rgba(255,255,255,0.1);\
      border-radius: 8px;\
      padding: 8px 12px;\
      color: white;\
      font-size: 13px;\
      outline: none;\
      font-family: inherit;\
    }\
    .lf-chat-input::placeholder { color: rgba(255,255,255,0.3); }\
    .lf-chat-send {\
      background: ' + primaryColor + ';\
      color: #0a1628;\
      border: none;\
      border-radius: 8px;\
      padding: 8px 14px;\
      font-weight: 700;\
      font-size: 13px;\
      cursor: pointer;\
    }\
    .lf-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }\
    .lf-intake-btn {\
      background: ' + primaryColor + ';\
      color: #0a1628;\
      border: none;\
      border-radius: 8px;\
      padding: 10px 16px;\
      font-weight: 700;\
      font-size: 13px;\
      cursor: pointer;\
      width: 100%;\
      margin-top: 8px;\
    }\
  ';
  document.head.appendChild(style);

  var chatBtn = document.createElement('button');
  chatBtn.className = 'lf-chat-btn';
  chatBtn.innerHTML = '💬';
  chatBtn.title = 'Chat with us';
  document.body.appendChild(chatBtn);

  var chatWindow = document.createElement('div');
  chatWindow.className = 'lf-chat-window';
  chatWindow.innerHTML =
    '<div class="lf-chat-header">' +
      '<div class="lf-chat-avatar">⚖️</div>' +
      '<div>' +
        '<div class="lf-chat-title">' + firmName + '</div>' +
        '<div class="lf-chat-subtitle">● Online · Replies instantly</div>' +
      '</div>' +
    '</div>' +
    '<div class="lf-chat-messages" id="lf-messages">' +
      '<div class="lf-msg lf-msg-bot">👋 Hello! I\'m here to help with your immigration questions. How can I assist you today?</div>' +
    '</div>' +
    '<div class="lf-chat-input-area">' +
      '<input class="lf-chat-input" id="lf-input" placeholder="Type your question..." />' +
      '<button class="lf-chat-send" id="lf-send">→</button>' +
    '</div>';
  document.body.appendChild(chatWindow);

  var messagesEl = chatWindow.querySelector('#lf-messages');
  var inputEl = chatWindow.querySelector('#lf-input');
  var sendBtn = chatWindow.querySelector('#lf-send');

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(role, text) {
    var div = document.createElement('div');
    div.className = 'lf-msg ' + (role === 'user' ? 'lf-msg-user' : 'lf-msg-bot');
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'lf-typing';
    div.id = 'lf-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    scrollToBottom();
    return div;
  }

  function removeTyping() {
    var el = document.getElementById('lf-typing');
    if (el) el.remove();
  }

  async function sendMessage() {
    var text = inputEl.value.trim();
    if (!text || isLoading) return;

    inputEl.value = '';
    addMessage('user', text);
    messages.push({ role: 'user', content: text });

    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    try {
      var res = await fetch('https://app.lexflow.co.uk/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages, slug: slug, firmId: null })
      });
      var data = await res.json();

      removeTyping();
      addMessage('assistant', data.message);
      messages.push({ role: 'assistant', content: data.message });

      if (data.intakeData) {
        var bookBtn = document.createElement('button');
        bookBtn.className = 'lf-intake-btn';
        bookBtn.textContent = '📋 Complete Your Consultation Booking';
        bookBtn.onclick = function() {
          var params = new URLSearchParams(data.intakeData);
          window.open('https://app.lexflow.co.uk/intake/' + slug + '?prefill=true&' + params.toString(), '_blank');
        };
        messagesEl.appendChild(bookBtn);
        scrollToBottom();
      }
    } catch (err) {
      removeTyping();
      addMessage('assistant', 'Sorry, I\'m having trouble connecting. Please try again or call us directly.');
    }

    isLoading = false;
    sendBtn.disabled = false;
  }

  chatBtn.addEventListener('click', function() {
    isOpen = !isOpen;
    chatWindow.classList.toggle('open', isOpen);
    chatBtn.innerHTML = isOpen ? '×' : '💬';
    if (isOpen) inputEl.focus();
  });

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendMessage();
  });
})();
