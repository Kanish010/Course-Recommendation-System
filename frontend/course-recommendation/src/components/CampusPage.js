import React from 'react';
import { FiSettings } from 'react-icons/fi';
import './CampusPage.css';

const CampusPage = ({ onSettings, onCampusSelect }) => {
  return (
    <div className="choose-campus">
      <div className="settings-icon-container">
        <FiSettings className="settings-icon" onClick={onSettings} />
      </div>
      <div className="campus okanagan" onClick={() => onCampusSelect('Okanagan')}>
        <h2 className="campus-text">Okanagan</h2>
      </div>
      <div className="prompt">
        <h2>Which campus are you interested in?</h2>
      </div>
      <div className="campus vancouver" onClick={() => onCampusSelect('Vancouver')}>
        <h2 className="campus-text">Vancouver</h2>
      </div>
    </div>
  );
};

export default CampusPage;