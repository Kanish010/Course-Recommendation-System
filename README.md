# Course Recommendation System

## Overview

The Course Recommendation System is a web application designed to help users find and manage courses based on their interests, preferences, and academic history for both campuses of the University of British Columbia. The system provides course recommendations, allows users to rate courses, view favorite courses, and maintain a history of their searches. Users can also interact with the chatbot built into the recommendation chat interface to learn more about any subject they like. This application is built using ReactJS and CSS on the frontend and a backend API that interacts with a MySQL database.

## Features

- User Authentication: Secure login for users.
- Campus Selection: Users can choose between Okanagan and Vancouver campuses.
- Course Recommendation: Provides personalized course recommendations.
- Course Rating: Users can rate courses and provide feedback.
- Favorite Courses: Users can save and view their favorite courses.
- Search History: Users can view their search history.
- Settings: Users can manage their account settings, view ratings, and logout.

## Usage

	1.	Login: Users need to log in to access the features.
	2.	Select Campus: After logging in, select your campus to see relevant courses.
	3.	Course Recommendations: View recommended courses based on your profile and preferences.
	4.	Rate Courses: Rate and review courses that you have taken.
	5.	Manage Favorites: Add courses to your favorites and manage them from the settings.
	6.	Settings: Access your profile settings, view your ratings, and manage your account.

### Technologies USed

- ReactJS
- CSS
- Python
- Flask
- MYSQL 

### Folder Structure

- public/Images/: Contains all static images used in the project.
- src/components/: Contains React components like CampusPage, EntryPage, Settings, etc.
- src/config.js: Centralized configuration file for environment variables and image paths.
- src/App.js: Main application file containing routing logic.
- .env: Stores OpenAI API key, and database connection details. (This file is part of .gitignore)
