import React, { useState } from 'react';
import EntryPage from './components/EntryPage';
import CampusPage from './components/CampusPage';
import ChatPage from './components/ChatPage';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Store userId after login
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(null); // Campus selection

  const handleLogin = (id) => {
    setIsLoggedIn(true);
    setUserId(id); // Save userId
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null); // Clear userId on logout
    setShowSettings(false);
    setSelectedCampus(null); // Reset campus selection on logout
  };

  const handleCampusSelection = (campus) => {
    setSelectedCampus(campus); // Save selected campus
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <EntryPage onLogin={handleLogin} />
      ) : showSettings ? (
        <Settings onClose={handleCloseSettings} onLogout={handleLogout} userId={userId} />
      ) : !selectedCampus ? (
        <CampusPage onSettings={handleSettings} onCampusSelect={handleCampusSelection} />
      ) : (
        <ChatPage
          onSettings={handleSettings}
          campus={selectedCampus}
          onCampusChange={setSelectedCampus}
          userId={userId}
        />
      )}
    </div>
  );
}

export default App;