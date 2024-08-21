import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './FavoriteCoursesModal.css';

const FavoriteCoursesModal = ({ isOpen, onClose, userId }) => {
  const [courses, setCourses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewingFavorites, setViewingFavorites] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/favorite_courses/${userId}`);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorite courses', error);
    }
  }, [userId]);

  const fetchCourses = useCallback(async (query = '') => {
    try {
      setIsLoading(true); // Set loading state
      const response = await axios.get('http://127.0.0.1:5000/api/courses', {
        params: { query }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses', error);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchFavorites();
      fetchCourses(); // Fetch all courses initially
      setSearchQuery('');
      setViewingFavorites(true); // Show favorites by default
    }
  }, [isOpen, fetchFavorites, fetchCourses]);

  const handleSearch = async (e) => {
    const query = e.target.value.trim(); // Trim whitespace
    setSearchQuery(query);
    if (query) {
      setViewingFavorites(false);
      await fetchCourses(query);
    } else {
      setViewingFavorites(true);
    }
  };

  const handleSearchFocus = async () => {
    setViewingFavorites(false);
    await fetchCourses(); // Show all courses when search bar is focused
  };

  const toggleFavorite = async (course_id) => {
    try {
      if (favorites.some(fav => fav.course_id === course_id)) {
        await axios.delete('http://127.0.0.1:5000/api/favorite_courses', {
          data: { user_id: userId, course_id }
        });
        setFavorites(favorites.filter(fav => fav.course_id !== course_id));
      } else {
        const courseToAdd = courses.find(course => course['Course ID'] === course_id);
        await axios.post('http://127.0.0.1:5000/api/favorite_courses', {
          user_id: userId,
          course_id: courseToAdd['Course ID'],
          course_title: courseToAdd['Course Title']
        });
        setFavorites([...favorites, { course_id: courseToAdd['Course ID'], course_title: courseToAdd['Course Title'] }]);
      }
    } catch (error) {
      console.error('Error toggling favorite course', error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setViewingFavorites(true);
  };

  if (!isOpen) return null;

  return (
    <div className="favorite-courses-modal-overlay">
      <div className="favorite-courses-modal">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Favorite Courses</h2>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={handleSearch}
            onFocus={handleSearchFocus} // Fetch all courses on focus
          />
          <button className="clear-button" onClick={handleClearSearch}>
            Clear
          </button>
        </div>
        <div className="course-list">
          {isLoading ? (
            <p>Loading courses...</p>
          ) : viewingFavorites ? (
            favorites.length > 0 ? (
              favorites.map(course => (
                <div key={course.course_id} className="course-item">
                  <span>{course.course_id} - {course.course_title}</span>
                  <button
                    className="star-button filled"
                    onClick={() => toggleFavorite(course.course_id)}
                  >
                    ★
                  </button>
                </div>
              ))
            ) : (
              <p>No favorite courses yet.</p>
            )
          ) : (
            courses.length > 0 ? (
              courses.map(course => (
                <div key={course['Course ID']} className="course-item">
                  <span>{course['Course ID']} - {course['Course Title']}</span>
                  <button
                    className={`star-button ${favorites.some(fav => fav.course_id === course['Course ID']) ? 'filled' : 'empty'}`}
                    onClick={() => toggleFavorite(course['Course ID'])}
                  >
                    {favorites.some(fav => fav.course_id === course['Course ID']) ? '★' : '☆'}
                  </button>
                </div>
              ))
            ) : (
              <p>No courses found.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteCoursesModal;