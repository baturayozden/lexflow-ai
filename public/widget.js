(function() {
  var slug = document.currentScript.getAttribute('data-slug');
  if (!slug) {
    console.error('LexFlow Widget: data-slug attribute is required');
    return;
  }

  var primaryColor = document.currentScript.getAttribute('data-color') || '#c9a84c';
  var buttonText = document.currentScript.getAttribute('data-text') || 'Book a Free Consultation';
  var buttonPosition = document.currentScript.getAttribute('data-position') || 'bottom-right';

  var style = document.createElement('style');
  style.textContent = '\
    .lexflow-widget-btn {\
      position: fixed;\
      ' + (buttonPosition === 'bottom-left' ? 'left: 24px;' : 'right: 24px;') + '\
      bottom: 24px;\
      background: ' + primaryColor + ';\
      color: #0a1628;\
      border: none;\
      padding: 14px 24px;\
      border-radius: 50px;\
      font-weight: 700;\
      font-size: 14px;\
      cursor: pointer;\
      box-shadow: 0 4px 24px rgba(0,0,0,0.3);\
      z-index: 999998;\
      font-family: "Helvetica Neue", Arial, sans-serif;\
      transition: transform 0.2s, box-shadow 0.2s;\
    }\
    .lexflow-widget-btn:hover {\
      transform: translateY(-2px);\
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);\
    }\
    .lexflow-modal-overlay {\
      display: none;\
      position: fixed;\
      inset: 0;\
      background: rgba(0,0,0,0.7);\
      z-index: 999999;\
      backdrop-filter: blur(4px);\
      align-items: center;\
      justify-content: center;\
    }\
    .lexflow-modal-overlay.active {\
      display: flex;\
    }\
    .lexflow-modal {\
      background: #0a1628;\
      border-radius: 16px;\
      width: 90%;\
      max-width: 560px;\
      max-height: 90vh;\
      overflow-y: auto;\
      position: relative;\
      border: 1px solid rgba(255,255,255,0.1);\
    }\
    .lexflow-modal-header {\
      padding: 20px 24px;\
      border-bottom: 1px solid rgba(255,255,255,0.08);\
      display: flex;\
      align-items: center;\
      justify-content: space-between;\
    }\
    .lexflow-modal-close {\
      background: none;\
      border: none;\
      color: rgba(255,255,255,0.4);\
      font-size: 24px;\
      cursor: pointer;\
      padding: 0;\
      line-height: 1;\
    }\
    .lexflow-modal-close:hover { color: white; }\
    .lexflow-modal iframe {\
      width: 100%;\
      border: none;\
      border-radius: 0 0 16px 16px;\
      min-height: 600px;\
    }\
  ';
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.className = 'lexflow-widget-btn';
  btn.textContent = buttonText;
  document.body.appendChild(btn);

  var overlay = document.createElement('div');
  overlay.className = 'lexflow-modal-overlay';
  overlay.innerHTML =
    '<div class="lexflow-modal">' +
      '<div class="lexflow-modal-header">' +
        '<span style="color:white;font-weight:600;font-size:15px;">Book a Consultation</span>' +
        '<button class="lexflow-modal-close" onclick="this.closest(\'.lexflow-modal-overlay\').classList.remove(\'active\')">×</button>' +
      '</div>' +
      '<iframe src="https://app.lexflow.co.uk/intake/' + slug + '?embed=true" title="Book a Consultation"></iframe>' +
    '</div>';
  document.body.appendChild(overlay);

  btn.addEventListener('click', function() {
    overlay.classList.add('active');
  });

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.classList.remove('active');
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') overlay.classList.remove('active');
  });
})();
