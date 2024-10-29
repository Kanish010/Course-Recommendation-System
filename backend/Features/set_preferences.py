from database import create_connection, close_connection

def set_user_preferences(user_id):
    preferred_levels = input("Enter your preferred course levels (e.g., 100, 200, 300, leave blank for all): ").strip() or "All Levels"
    interests = input("Enter your interests (comma separated): ").strip()
    preferred_campus = input("Enter your preferred campus (Okanagan/Vancouver): ").strip()

    db = create_connection()
    cursor = db.cursor()
    
    cursor.execute("""
        INSERT INTO "UserPreferences" (user_id, preferred_levels, interests, preferred_campus)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (user_id) DO UPDATE
        SET preferred_levels = EXCLUDED.preferred_levels,
            interests = EXCLUDED.interests,
            preferred_campus = EXCLUDED.preferred_campus
    """, (user_id, preferred_levels, interests, preferred_campus))
    
    db.commit()
    close_connection(db)
    print("Preferences updated successfully.")