import React, { useState } from 'react';
import './Settings.css';
import SearchHistoryModal from './SearchHistoryModal';
import CourseRatingModal from './CourseRatingModal';
import FavoriteCoursesModal from './FavoriteCoursesModal'; // Import the FavoriteCoursesModal

const Settings = ({ onClose, onLogout, userId }) => {
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showCourseRating, setShowCourseRating] = useState(false);
  const [showFavoriteCourses, setShowFavoriteCourses] = useState(false); // State for showing the FavoriteCoursesModal

  const handleViewSearchHistory = () => {
    setShowSearchHistory(true);
  };

  const handleCloseSearchHistory = () => {
    setShowSearchHistory(false);
  };

  const handleRateCourses = () => {
    setShowCourseRating(true);
  };

  const handleCloseCourseRating = () => {
    setShowCourseRating(false);
  };

  const handleViewFavoriteCourses = () => {
    setShowFavoriteCourses(true);
  };

  const handleCloseFavoriteCourses = () => {
    setShowFavoriteCourses(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>SETTINGS</h1>
      </div>
      <div className="settings-content">
        <button onClick={handleViewSearchHistory}>View Search History</button>
        <button onClick={handleRateCourses}>Rate Courses</button>
        <button onClick={handleViewFavoriteCourses}>View Favorite Courses</button> 
        <button onClick={onClose}>Close</button>
        <button onClick={onLogout}>Logout</button>
      </div>
      {showSearchHistory && (
        <SearchHistoryModal userId={userId} onClose={handleCloseSearchHistory} />
      )}
      {showCourseRating && (
        <CourseRatingModal isOpen={showCourseRating} onClose={handleCloseCourseRating} userId={userId} />
      )}
      {showFavoriteCourses && (
        <FavoriteCoursesModal isOpen={showFavoriteCourses} onClose={handleCloseFavoriteCourses} userId={userId} />
      )}
    </div>
  );
};

export default Settings;
