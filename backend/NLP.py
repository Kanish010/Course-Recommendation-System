import os
import re
import mysql.connector
from dotenv import load_dotenv
from openai import OpenAI
import logging

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) 
logging.basicConfig(level=logging.INFO)

db_connection = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)

def search_courses(query, campus):
    try:
        cursor = db_connection.cursor(dictionary=True)
        query_pattern = f"%{query}%"
        
        # Modify the SQL query to filter based on the campus column
        cursor.execute(f"""
            SELECT `Subject`, `Course ID`, `Course Title`, `Course Description`, `Credits` 
            FROM Courses 
            WHERE (`Course Title` LIKE %s OR `Course Description` LIKE %s OR `Subject` LIKE %s)
            AND `Campus` = %s
        """, (query_pattern, query_pattern, query_pattern, campus))
        
        relevant_courses = cursor.fetchall()
        cursor.close()

        return relevant_courses if relevant_courses else None
    except Exception as e:
        logging.error(f"Error searching courses: {e}")
        return None

def save_recommendation(user_id, course, campus, search_id):
    try:
        cursor = db_connection.cursor()
        cursor.execute("""
            INSERT INTO RecommendedCourses (user_id, course_title, course_id, campus, search_id)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, course['Course Title'], course['Course ID'], campus, search_id))
        db_connection.commit()
        cursor.close()
    except Exception as e:
        logging.error(f"Error saving recommended course: {e}")

def chat_with_gpt(prompt, chat_history, campus, user_id=None, search_id=None):
    try:
        # Check if the query is related to a course in the dataset
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
            # If not course-related, continue the conversation with GPT
            chat_history.append({"role": "user", "content": prompt})
            response = client.chat.completions.create(model="gpt-3.5-turbo",
            messages=chat_history)
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

        response = chat_with_gpt(user_input, chat_history)
        print("Chatbot: ", response)