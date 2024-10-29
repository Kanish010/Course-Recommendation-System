-- Create Database (Note: In PostgreSQL, you don't use 'IF NOT EXISTS' for creating databases)
CREATE DATABASE CourseRecommendationDB;

-- Switch to the new database
\c CourseRecommendationDB;

-- Users Table
CREATE TABLE IF NOT EXISTS "Users" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- UserLastSearch Table
CREATE TABLE IF NOT EXISTS "UserLastSearch" (
    user_id INT PRIMARY KEY,
    preferred_levels VARCHAR(50),
    interests TEXT,
    preferred_campus VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES "Users"(user_id) ON DELETE CASCADE
);

-- UserSearchHistory Table
CREATE TABLE IF NOT EXISTS "UserSearchHistory" (
    search_id SERIAL PRIMARY KEY,
    user_id INT,
    search_query VARCHAR(255),
    search_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    result_count INT,
    FOREIGN KEY (user_id) REFERENCES "Users"(user_id) ON DELETE CASCADE
);

-- RecommendedCourses Table
CREATE TABLE IF NOT EXISTS "RecommendedCourses" (
    id SERIAL PRIMARY KEY,
    user_id INT,
    course_title VARCHAR(255),
    course_id VARCHAR(50),
    campus VARCHAR(50),
    search_id INT,
    FOREIGN KEY (user_id) REFERENCES "Users"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (search_id) REFERENCES "UserSearchHistory"(search_id) ON DELETE CASCADE
);

-- Courses Table
CREATE TABLE IF NOT EXISTS "Courses" (
    list_num SERIAL PRIMARY KEY,
    "Subject" TEXT,
    "Course ID" TEXT NOT NULL,
    "Course Title" TEXT NOT NULL,
    "Course Description" TEXT,
    "Credits" TEXT,
    "Campus" TEXT
);

-- UserPreferences Table
CREATE TABLE IF NOT EXISTS "UserPreferences" (
    user_id INT PRIMARY KEY,
    preferred_levels VARCHAR(50),
    interests TEXT,
    preferred_campus VARCHAR(50),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES "Users"(user_id) ON DELETE CASCADE
);

-- FavoriteCourses Table
CREATE TABLE IF NOT EXISTS "FavoriteCourses" (
    user_id INT,
    course_id VARCHAR(50),
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES "Users"(user_id) ON DELETE CASCADE
);

-- CourseRatings Table
CREATE TABLE IF NOT EXISTS "CourseRatings" (
    rating_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "Users"(user_id) ON DELETE CASCADE,
    UNIQUE (user_id, course_id)
);