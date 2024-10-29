import os
import re
import psycopg2
from dotenv import load_dotenv
from openai import OpenAI
import logging

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
logging.basicConfig(level=logging.INFO)

db_connection = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    dbname=os.getenv("DB_NAME")
)

def search_courses(query, campus):
    try:
        cursor = db_connection.cursor()
        query_pattern = f"%{query}%"
        
        # Filter based on campus
        cursor.execute("""
            SELECT "Subject", "Course ID", "Course Title", "Course Description", "Credits" 
            FROM "Courses" 
            WHERE ("Course Title" ILIKE %s OR "Course Description" ILIKE %s OR "Subject" ILIKE %s)
            AND "Campus" = %s
        """, (query_pattern, query_pattern, query_pattern, campus))
        
        relevant_courses = cursor.fetchall()
        cursor.close()

        return [
            {
                "Subject": course[0],
                "Course ID": course[1],
                "Course Title": course[2],
                "Course Description": course[3],
                "Credits": course[4]
            } 
            for course in relevant_courses
        ] if relevant_courses else None
    except Exception as e:
        logging.error(f"Error searching courses: {e}")
        return None

def save_recommendation(user_id, course, campus, search_id):
    try:
        cursor = db_connection.cursor()
        cursor.execute("""
            INSERT INTO "RecommendedCourses" (user_id, course_title, course_id, campus, search_id)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, course['Course Title'], course['Course ID'], campus, search_id))
        db_connection.commit()
        cursor.close()
    except Exception as e:
        logging.error(f"Error saving recommended course: {e}")

def chat_with_gpt(prompt, chat_history, campus, user_id=None, search_id=None):
    try:
        courses = search_courses(prompt, campus)
        if courses:
            response_text = "<strong>Here are some courses related to your query:</strong><br> <br>"
            for course in courses:
                response_text += (
                    '<div style="text-align: left;">'  
                    f"<strong>{course['Course Title']}: {course['Course ID']}</strong><br>"
                    f"Description: {course['Course Description']}<br>"
                    f"Credits: {course['Credits']}<br><br>"
                    '</div>'
                )
                save_recommendation(user_id, course, campus, search_id)
            return response_text
        else:
            chat_history.append({"role": "user", "content": prompt})
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=chat_history
            )
            message = response.choices[0].message.content.strip()
            chat_history.append({"role": "assistant", "content": message})
            return f'<div style="text-align: left;">{message}</div>'
    except Exception as e:
        logging.error(f"Error in chat_with_gpt: {e}")
        return "There was an error processing your request."

if __name__ == "__main__":
    chat_history = []
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            break

        response = chat_with_gpt(user_input, chat_history, campus="main")  # Specify campus as needed
        print("Chatbot: ", response)