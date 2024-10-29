from database import create_connection, close_connection

def get_favorite_courses(user_id):
    """Fetch the user's favorite courses along with course titles."""
    db = create_connection()
    cursor = db.cursor()
    
    cursor.execute("""
        SELECT FC.course_id, C."Course Title" as course_title
        FROM "FavoriteCourses" FC
        JOIN "Courses" C ON FC.course_id = C."Course ID"
        WHERE FC.user_id = %s
    """, (user_id,))
    
    favorites = cursor.fetchall()
    favorites_list = [{"course_id": fav[0], "course_title": fav[1]} for fav in favorites]  # Convert to dictionary format
    close_connection(db)
    return favorites_list

def remove_from_favorites(user_id, course_id):
    """Remove a course from the user's favorites."""
    db = create_connection()
    cursor = db.cursor()
    
    cursor.execute("""
        DELETE FROM "FavoriteCourses"
        WHERE user_id = %s AND course_id = %s
    """, (user_id, course_id))
    db.commit()
    
    message = f"Course {course_id} has been removed from your favorites." if cursor.rowcount > 0 else "Course not found in your favorites."
    close_connection(db)
    return message

def add_to_favorites(user_id, course_id):
    """Add a course to the user's favorites."""
    db = create_connection()
    cursor = db.cursor()

    try:
        # Check if the course exists in the Courses table
        cursor.execute("SELECT \"Course ID\" FROM \"Courses\" WHERE \"Course ID\" = %s", (course_id,))
        course = cursor.fetchone()

        if course:
            # Check if the course is already in the user's favorites
            cursor.execute("SELECT * FROM \"FavoriteCourses\" WHERE user_id = %s AND course_id = %s", (user_id, course_id))
            existing_favorite = cursor.fetchone()

            if existing_favorite:
                message = f"Course {course_id} is already in your favorites."
            else:
                # Insert the course into the user's favorites
                cursor.execute("""
                    INSERT INTO "FavoriteCourses" (user_id, course_id)
                    VALUES (%s, %s)
                """, (user_id, course_id))
                db.commit()
                message = f"Course {course_id} has been added to your favorites."
        else:
            message = "Invalid Course ID. The course does not exist."

    except Exception as e:
        message = f"An error occurred: {str(e)}"

    finally:
        close_connection(db)

    return message

def get_courses(search_query):
    """Retrieve courses from the database based on a search query."""
    db = create_connection()
    cursor = db.cursor()
    try:
        cursor.execute("""
            SELECT "Course ID", "Course Title"
            FROM "Courses"
            WHERE "Course ID" ILIKE %s OR "Course Title" ILIKE %s
        """, (f"%{search_query}%", f"%{search_query}%"))
        courses = cursor.fetchall()
        courses_list = [{"course_id": course[0], "course_title": course[1]} for course in courses]  # Convert to dictionary format
    except Exception as e:
        print(f"Error fetching courses: {e}")
        courses_list = []
    finally:
        close_connection(db)
    return courses_list