import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './CourseRatingModal.css';

const CourseRatingModal = ({ isOpen, onClose, userId }) => {
  const [courseId, setCourseId] = useState('');
  const [rating, setRating] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [viewRatings, setViewRatings] = useState(false);
  const [ratingsList, setRatingsList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRatings = useCallback(async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/view_ratings/${userId}`);
      if (response.status === 200) {
        setRatingsList(response.data);
      } else {
        setMessage({ text: 'Failed to fetch ratings.', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching ratings', error);
      setMessage({ text: 'An error occurred while fetching your ratings.', type: 'error' });
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
    if (viewRatings) {
      fetchRatings();
    } else {
      fetchCourses(); // Fetch all courses initially
    }
  }, [viewRatings, fetchRatings, fetchCourses]);

  const handleSearch = async (e) => {
    const query = e.target.value.trim(); // Trim whitespace
    setSearchQuery(query);
    setShowDropdown(true); // Show the dropdown when searching
    if (query) {
      await fetchCourses(query);
    } else {
      setCourses([]); // Clear the course list when the search query is empty
    }
  };

  const handleCourseSelect = (courseId, courseTitle) => {
    setCourseId(courseId);
    setSearchQuery(`${courseId} - ${courseTitle}`); // Show the selected course in the search bar
    setShowDropdown(false); // Hide the dropdown after selecting a course
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCourses([]);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/rate_course', {
        user_id: userId,
        course_id: courseId,
        rating: rating,
        feedback: feedback,
      });
      if (response.status === 201) {
        setMessage({ text: response.data.message, type: 'success' });
        setCourseId('');
        setRating(1);
        setFeedback('');
      } else {
        setMessage({ text: 'An error occurred while submitting your rating.', type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting rating', error);
      setMessage({ text: 'An error occurred while submitting your rating.', type: 'error' });
    }
  };

  const handleDelete = async (courseId) => {
    try {
      const response = await axios.delete('http://127.0.0.1:5000/api/delete_rating', {
        data: { user_id: userId, course_id: courseId },
      });
      if (response.status === 200) {
        setMessage({ text: response.data.message, type: 'success' });
        fetchRatings(); // Refresh the ratings list after deletion
      } else {
        setMessage({ text: 'Failed to delete rating.', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting rating', error);
      setMessage({ text: 'An error occurred while deleting your rating.', type: 'error' });
    }
  };

  const toggleViewRatings = () => {
    setViewRatings(!viewRatings);
  };

  if (!isOpen) return null;

  return (
    <div className="course-rating-modal-overlay">
      <div className="course-rating-modal">
        <button className="course-rating-close-button" onClick={onClose}>X</button>
        <h2>{viewRatings ? 'Your Ratings' : 'Rate a Course'}</h2>
        
        {viewRatings ? (
          <div className="ratings-list">
            {ratingsList.length === 0 ? (
              <p>You have not rated any courses yet.</p>
            ) : (
              ratingsList.map((rating) => (
                <div key={rating.course_id} className="rating-item">
                  <div className="rating-info">
                    <strong>{rating.course_id}</strong>: {rating.rating} Stars
                    <p>{rating.feedback}</p>
                  </div>
                  <button className="delete-button" onClick={() => handleDelete(rating.course_id)}>x</button>
                </div>
              ))
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="course-rating-form">
            <div className="course-rating-form-group">
              <label htmlFor="course-id">Course ID:</label>
              <input
                type="text"
                id="course-id"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="e.g., MGMT_O 450"
                required
                onFocus={() => setShowDropdown(true)} // Show dropdown on focus
              />
              <button
                type="button"
                className="clear-button"
                onClick={handleClearSearch}
              >
                Clear
              </button>
              {showDropdown && courses.length > 0 && (
                <div className="course-list">
                  {isLoading ? (
                    <p>Loading courses...</p>
                  ) : (
                    courses.map((course) => (
                      <div
                        key={course['Course ID']}
                        className="course-item"
                        onClick={() => handleCourseSelect(course['Course ID'], course['Course Title'])}
                      >
                        <span>{course['Course ID']} - {course['Course Title']}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="course-rating-form-group">
              <label htmlFor="rating">Rating:</label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} Star{value > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="course-rating-form-group">
              <label htmlFor="feedback">Feedback:</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about the course..."
              ></textarea>
            </div>
            <button type="submit" className="course-rating-submit-button">Submit Rating</button>
          </form>
        )}

        <button onClick={toggleViewRatings} className="toggle-view-button">
          {viewRatings ? 'Back to Rating' : 'View My Ratings'}
        </button>

        {message && (
          <p className={`course-rating-message ${message.type}`}>{message.text}</p>
        )}
      </div>
    </div>
  );
};

export default CourseRatingModal;