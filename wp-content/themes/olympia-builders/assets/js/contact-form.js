(function() {
  // Sends the contact form to the office without leaving the page.
  var form = document.querySelector('form.wpcf7-form');
  if (!form || !window.fetch || !window.URLSearchParams) return;
  var note = form.querySelector('.wpcf7-response-output');
  var button = form.querySelector('[type="submit"]');
  var label = button ? button.value : '';

  function say(kind, message) {
    if (!note) return;
    note.textContent = message;
    note.className = 'wpcf7-response-output form-note form-note--' + kind;
    note.removeAttribute('aria-hidden');
    note.setAttribute('role', 'status');
  }

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var data = new URLSearchParams(new FormData(form));
    data.set('_page', location.pathname);
    if (button) { button.disabled = true; button.value = 'Sending...'; }
    say('wait', 'Sending your inquiry...');
    // Give up after 25 seconds, so the visitor is never left waiting without an answer.
    var stop = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function() { if (stop) stop.abort(); }, 25000);
    fetch(form.action, { method: 'POST', body: data, signal: stop ? stop.signal : undefined })
      .then(function(response) { return response.json(); })
      .then(function(result) {
        if (!result || !result.ok) throw new Error('not accepted');
        form.reset();
        say('ok', 'Thank you. Your inquiry is on its way to our office, and we will be in touch shortly.');
      })
      .catch(function() {
        say('bad', 'Sorry, that did not go through. Please email office@olympiaholdings.com or call 732-535-7460.');
      })
      .then(function() {
        clearTimeout(timer);
        if (button) { button.disabled = false; button.value = label; }
      });
  });
})();
