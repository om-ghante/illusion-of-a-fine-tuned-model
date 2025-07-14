const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// File to store chat history
const chatHistoryPath = path.join(__dirname, '../data/chat-history.json');

// Ensure the file exists
if (!fs.existsSync(chatHistoryPath)) {
  fs.writeFileSync(chatHistoryPath, '[]');
}

router.post('/', async (req, res) => {
  const userMessage = req.body.message;

  // Use Gemini API here if needed — using dummy response for now
  const botReply = `You said: ${userMessage}`;

  // Prepare the log entry
  const entry = {
    timestamp: new Date().toISOString(),
    user: userMessage,
    bot: botReply,
  };

  try {
    // Read existing data
    const data = JSON.parse(fs.readFileSync(chatHistoryPath, 'utf-8'));
    // Append the new entry
    data.push(entry);
    // Save back to file
    fs.writeFileSync(chatHistoryPath, JSON.stringify(data, null, 2));

    res.json({ reply: botReply });
  } catch (err) {
    console.error('Error writing to file:', err);
    res.status(500).json({ reply: 'Error saving chat history.' });
  }
});

module.exports = router;
