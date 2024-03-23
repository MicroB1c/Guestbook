const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const baseHTML = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/main.css">
</head>
<body>
  <div class="navbar">
    <a href="/">Home</a> |
    <a href="/guestbook">View Guestbook</a> |
    <a href="/newmessage">Leave a New Message</a> |
    <a href="/ajaxmessage">Leave a Message via AJAX</a>
  </div>
  ${content}
  <a href="/" class="back-home">Back to home</a>
</body>
</html>
`;

app.get('/', (req, res) => {
  const content = `<h1>Welcome to the Guestbook App</h1>`;
  res.send(baseHTML('Guestbook App', content));
});

app.get('/guestbook', (req, res) => {
  fs.readFile('guestbook.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the guestbook.');
      return;
    }
    const messages = JSON.parse(data);
    let messageList = messages.map(message => 
      `<li>${message.username} from ${message.country} says: ${message.message}</li>`
    ).join('');
    let content = `<h1>Guestbook Messages</h1><ul>${messageList}</ul>`;
    res.send(baseHTML('View Guestbook', content));
  });
});

app.get('/newmessage', (req, res) => {
  const content = `
    <h1>Add a New Message</h1>
    <form action="/newmessage" method="post">
      <input type="text" name="username" placeholder="Username" required />
      <input type="text" name="country" placeholder="Country" required />
      <textarea name="message" placeholder="Your message here" required></textarea>
      <button type="submit">Send</button>
    </form>
  `;
  res.send(baseHTML('Leave a New Message', content));
});

app.get('/ajaxmessage', (req, res) => {
  const content = `
    <h1>Add a New AJAX Message</h1>
    <form id="ajaxForm">
      <input type="text" id="username" name="username" placeholder="Username" required />
      <input type="text" id="country" name="country" placeholder="Country" required />
      <textarea id="message" name="message" placeholder="Your message here" required></textarea>
      <button type="button" id="sendButton">Send AJAX Message</button>
    </form>
    <div id="messageContainer"></div>
    <script src="/ajax.js"></script>
  `;
  res.send(baseHTML('Leave a Message via AJAX', content));
});

app.post('/newmessage', (req, res) => {
  const newMessage = req.body;
  fs.readFile('guestbook.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error saving the message.');
      return;
    }
    const messages = JSON.parse(data);
    messages.push(newMessage);
    fs.writeFile('guestbook.json', JSON.stringify(messages, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error saving the message.');
        return;
      }
      res.redirect('/guestbook');
    });
  });
});

app.post('/ajaxmessage', (req, res) => {
  const newMessage = req.body;
  fs.readFile('guestbook.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }
    const messages = JSON.parse(data);
    messages.push(newMessage);
    fs.writeFile('guestbook.json', JSON.stringify(messages, null, 2), (err) => {       if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }
    res.json(messages); // Sending back the updated list of messages
  });
});
});

app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});

     
