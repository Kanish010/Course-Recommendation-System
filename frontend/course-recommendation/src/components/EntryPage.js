import React from 'react';
import LoginForm from './LoginForm';
import './EntryPage.css';

const EntryPage = ({ onLogin }) => {
  return (
    <div className="entry-page">
      <div className="campus okanagan">
        <h2 className="campus-text">Okanagan</h2>
      </div>
      <div className="campus vancouver">
        <h2 className="campus-text">Vancouver</h2>
      </div>
      <LoginForm onLogin={onLogin} />
    </div>
  );
};

export default EntryPage;