import React, { useState } from 'react';
import axios from 'axios';
import { FiSettings } from 'react-icons/fi';
import { MdSend } from 'react-icons/md';
import './ChatPage.css';

const ChatPage = ({ onSettings, campus, onCampusChange, userId }) => {
  const [messages, setMessages] = useState([
    { sender: 'system', text: `Switched to the ${campus} campus. How can I assist you today?` }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', text: input }]);
      const userMessage = input;
      setInput('');

      try {
        console.log("User ID before sending request:", userId); // Add this for debugging
        console.log("User ID before sending request:", userId); // Debugging userId
        const response = await axios.post('http://127.0.0.1:5000/api/chatbot', {
          message: userMessage,
          campus,
          user_id: userId  // Pass the user_id received from the login process
        });
        if (response.data.success) {
          setMessages(prevMessages => [
            ...prevMessages,
            { sender: 'bot', text: response.data.response },
          ]);
        } else {
          setMessages(prevMessages => [
            ...prevMessages,
            { sender: 'system', text: 'There was an error processing your request.' },
          ]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'system', text: 'There was an error processing your request.' },
        ]);
      }
    }
  };

  const handleCampusChange = (event) => {
    const newCampus = event.target.value;
    onCampusChange(newCampus);
    setMessages([
      { sender: 'system', text: `Switched to the ${newCampus} campus. How can I assist you today?` }
    ]);
  };

  return (
    <div className={`chat-container ${campus.toLowerCase()}`}>
      <div className="chat-header">
        <div className="header-left">
          <h2>{campus} Campus Chat</h2>
          <select className="campus-dropdown" value={campus} onChange={handleCampusChange}>
            <option value="Okanagan">Okanagan</option>
            <option value="Vancouver">Vancouver</option>
          </select>
        </div>
        <FiSettings className="settings-icon" onClick={onSettings} />
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="send-button" onClick={sendMessage}>
          <MdSend />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;