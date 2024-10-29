from database import create_connection, close_connection

def rate_course(user_id, course_id, rating, feedback=None):
    db = create_connection()
    cursor = db.cursor()

    # Check if the user has already rated the course
    cursor.execute("""
        SELECT * FROM "CourseRatings" WHERE user_id = %s AND course_id = %s
    """, (user_id, course_id))
    existing_rating = cursor.fetchone()

    if existing_rating:
        return False, "You have already rated this course. Please update your rating if you want to change it."

    cursor.execute("""
        INSERT INTO "CourseRatings" (user_id, course_id, rating, feedback)
        VALUES (%s, %s, %s, %s)
    """, (user_id, course_id, rating, feedback))
    db.commit()
    close_connection(db)

    return True, f"Your rating of {rating} has been added for the course {course_id}."

def view_ratings(user_id):
    db = create_connection()
    cursor = db.cursor()
    cursor.execute("""
        SELECT course_id, rating, feedback 
        FROM "CourseRatings" 
        WHERE user_id = %s
    """, (user_id,))
    
    ratings = cursor.fetchall()
    ratings_list = [{"course_id": rating[0], "rating": rating[1], "feedback": rating[2]} for rating in ratings]  # Convert to dictionary format
    close_connection(db)
    
    return ratings_list if ratings_list else None

def delete_rating(user_id, course_id):
    db = create_connection()
    cursor = db.cursor()
    cursor.execute("""
        DELETE FROM "CourseRatings" 
        WHERE user_id = %s AND course_id = %s
    """, (user_id, course_id))
    db.commit()
    close_connection(db)

    return f"Rating for course {course_id} has been deleted."