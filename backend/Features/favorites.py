from database import create_connection, close_connection

def get_favorite_courses(user_id):
    """Fetch the user's favorite courses along with course titles."""
    db = create_connection()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT FC.course_id, C.`Course Title` as course_title
        FROM FavoriteCourses FC
        JOIN Courses C ON FC.course_id = C.`Course ID`
        WHERE FC.user_id = %s
    """, (user_id,))
    
    favorites = cursor.fetchall()
    close_connection(db)
    return favorites

def remove_from_favorites(user_id, course_id):
    """Remove a course from the user's favorites."""
    db = create_connection()
    cursor = db.cursor()
    
    cursor.execute("""
        DELETE FROM FavoriteCourses
        WHERE user_id = %s AND course_id = %s
    """, (user_id, course_id))
    db.commit()
    
    if cursor.rowcount > 0:
        message = f"Course {course_id} has been removed from your favorites."
    else:
        message = "Course not found in your favorites. Please check the Course ID and try again."
    
    close_connection(db)
    return message

from database import create_connection, close_connection

def add_to_favorites(user_id, course_id):
    """Add a course to the user's favorites."""
    db = create_connection()
    cursor = db.cursor()

    try:
        # Check if the course exists in the Courses table
        cursor.execute("SELECT `Course ID` FROM Courses WHERE `Course ID` = %s", (course_id,))
        course = cursor.fetchone()

        if course:
            # Check if the course is already in the user's favorites
            cursor.execute("""
                SELECT * FROM FavoriteCourses WHERE user_id = %s AND course_id = %s
            """, (user_id, course_id))
            existing_favorite = cursor.fetchone()

            if existing_favorite:
                message = f"Course {course_id} is already in your favorites."
            else:
                # Insert the course into the user's favorites
                cursor.execute("""
                    INSERT INTO FavoriteCourses (user_id, course_id)
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
    cursor = db.cursor(dictionary=True)
    try:
        # Adjust the query to match your actual table columns
        cursor.execute("""
            SELECT `Course ID`, `Course Title`
            FROM Courses
            WHERE `Course ID` LIKE %s OR `Course Title` LIKE %s
        """, (f"%{search_query}%", f"%{search_query}%"))
        courses = cursor.fetchall()
    except Exception as e:
        print(f"Error fetching courses: {e}")
        courses = []
    finally:
        close_connection(db)
    return courses