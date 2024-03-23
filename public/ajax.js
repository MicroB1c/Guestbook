document.addEventListener('DOMContentLoaded', function() {
  const sendButton = document.getElementById('sendButton');
  sendButton.addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const country = document.getElementById('country').value;
    const message = document.getElementById('message').value;

    // Убедитесь, что поля не пустые
    if (!username || !country || !message) {
      alert('All fields are required!');
      return;
    }

    fetch('/ajaxmessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, country, message }),
    })
    .then(response => response.json())
    .then(data => {
      const messageContainer = document.getElementById('messageContainer');
      messageContainer.innerHTML = ''; // Очистить текущие сообщения
      data.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `<strong>${msg.username}</strong> (${msg.country}): ${msg.message}`;
        messageContainer.appendChild(messageDiv);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
});
