import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchHistoryModal.css';

const SearchHistoryModal = ({ userId, onClose }) => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/search-history', {
          params: { user_id: userId }
        });
        if (response.data.success) {
          setSearchHistory(response.data.history);
        } else {
          setError('An error occurred while fetching search history.');
        }
      } catch (error) {
        console.error('Error fetching search history', error);
        setError('An error occurred while fetching search history.');
      }
    };

    fetchSearchHistory();
  }, [userId]);

  const handleClearHistory = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/clear-search-history', { user_id: userId });
      setSearchHistory([]);  // Clear the history in the UI
    } catch (error) {
      console.error('Error clearing search history', error);
      setError('An error occurred while clearing search history.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Search History</h2>
        {error ? (
          <p className="error-message">{error}</p>
        ) : searchHistory.length === 0 ? (
          <p>No search history available.</p>
        ) : (
          <div className="search-history-list">
            {searchHistory.map((course, index) => (
              <div key={index} className="search-item">
                <div className="recommended-courses">
                  <ul>
                    <li key={index}>
                      {course.course_title} ({course.course_id}) - {course.campus}
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button className="clear-history-button" onClick={handleClearHistory}>
            Clear Search History
          </button>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SearchHistoryModal;