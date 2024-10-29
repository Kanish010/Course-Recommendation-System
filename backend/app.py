from flask import Flask, request, jsonify
from flask_cors import CORS
from Features.registration_login import handle_registration, handle_login
from Features.search import perform_search
from Features.search_history import get_search_history, clear_search_history
from Features.rate_courses import rate_course, view_ratings, delete_rating
from Features.favorites import add_to_favorites, remove_from_favorites, get_favorite_courses, get_courses
from Features.set_preferences import set_user_preferences
from NLP import chat_with_gpt  

# Initialize Flask app
app = Flask(__name__)
CORS(app)  

# Initialize chat history
chat_history = []

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_input = data.get("message", "")
    user_id = data.get("user_id")
    campus = data.get("campus")
    search_id = data.get("search_id")  # Assume you have a way to get or generate this

    if not user_input:
        return jsonify({"success": False, "message": "No input provided"}), 400

    response = chat_with_gpt(user_input, chat_history, campus, user_id, search_id)
    return jsonify({"success": True, "response": response})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    user_id = handle_registration(data)
    if user_id:
        return jsonify({'success': True, 'user_id': user_id})
    else:
        return jsonify({'success': False, 'message': 'Registration failed'}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    result = handle_login(data)
    if result['success']:
        return jsonify({'success': True, 'user_id': result['user_id']})
    else:
        return jsonify({'success': False, 'message': result['message']}), 400

@app.route('/api/search', methods=['POST'])
def search():
    data = request.json
    query = data.get('query')
    campus = data.get('campus')

    search_results = perform_search(query, campus)
    return jsonify({"results": search_results})

@app.route('/api/search-history', methods=['GET'])
def search_history():
    user_id = request.args.get('user_id')
    history = get_search_history(user_id)

    if isinstance(history, dict) and "error" in history:
        return jsonify({"success": False, "message": history["error"]})

    return jsonify({"success": True, "history": history})

@app.route('/api/clear-search-history', methods=['POST'])
def clear_history():
    data = request.json
    user_id = data['user_id']
    result = clear_search_history(user_id)
    return jsonify({"success": True, "message": result["message"]})

@app.route('/api/preferences', methods=['POST'])
def preferences():
    data = request.json
    user_id = data['user_id']
    preferences = set_user_preferences(user_id)
    return jsonify(preferences)

@app.route('/api/rate_course', methods=['POST'])
def rate_course_endpoint():
    data = request.json
    user_id = data.get('user_id')
    course_id = data.get('course_id')
    rating = data.get('rating')
    feedback = data.get('feedback', None)

    success, message = rate_course(user_id, course_id, rating, feedback)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"message": message}), 400

@app.route('/api/delete_rating', methods=['DELETE'])
def delete_rating_endpoint():
    data = request.json
    user_id = data.get('user_id')
    course_id = data.get('course_id')

    message = delete_rating(user_id, course_id)
    return jsonify({"message": message}), 200

@app.route('/api/view_ratings/<int:user_id>', methods=['GET'])
def view_ratings_endpoint(user_id):
    ratings = view_ratings(user_id)
    if ratings:
        return jsonify(ratings), 200
    else:
        return jsonify({"message": "You have not rated any courses yet."}), 404

@app.route('/api/favorite_courses/<int:user_id>', methods=['GET'])
def get_favorite_courses_endpoint(user_id):
    try:
        favorites = get_favorite_courses(user_id)
        if favorites:
            return jsonify(favorites), 200
        else:
            return jsonify({"message": "No favorite courses found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/favorite_courses', methods=['POST'])
def add_to_favorite_courses_endpoint():
    try:
        data = request.json
        user_id = data.get('user_id')
        course_id = data.get('course_id')
        message = add_to_favorites(user_id, course_id)
        return jsonify({"message": message}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/favorite_courses', methods=['DELETE'])
def remove_from_favorite_courses_endpoint():
    try:
        data = request.json
        user_id = data.get('user_id')
        course_id = data.get('course_id')
        message = remove_from_favorites(user_id, course_id)
        return jsonify({"message": message}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/courses', methods=['GET'])
def get_courses_endpoint():
    search_query = request.args.get('query', '')
    try:
        courses = get_courses(search_query)
        if courses:
            return jsonify(courses), 200
        else:
            return jsonify({"message": "No courses found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)