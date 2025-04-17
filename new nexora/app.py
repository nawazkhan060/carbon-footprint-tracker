from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Supabase Setup
url = "https://phyoyhhaejukbeqgzzyl.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoeW95aGhhZWp1a2JlcWd6enlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDgwNTYsImV4cCI6MjA2MDM4NDA1Nn0.q4A49rFAzW5oxZdZkVhiPFcXC_Y-4g5RnF3pkz59Fuw"
supabase: Client = create_client(url, key)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup')
def signup_page():
    return render_template('signup.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([username, email, password]):
        return jsonify({'error': 'Missing fields'}), 400

    try:
        response = supabase.table('users').insert({
            'username': username,
            'email': email,
            'password': password  # TODO: Hash in production
        }).execute()
        return jsonify({'message': 'Registered successfully', 'user_id': response.data[0]['id']}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing fields'}), 400

    try:
        response = supabase.table('users').select('*').eq('email', email).execute()
        if not response.data:
            return jsonify({'error': 'User not found'}), 404

        user = response.data[0]
        if user['password'] != password:
            return jsonify({'error': 'Invalid credentials'}), 401

        return jsonify({
            'message': 'Login successful',
            'user': {'id': user['id'], 'username': user['username'], 'email': user['email']}
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/carbon-footprint', methods=['POST'])
def add_carbon_footprint():
    data = request.get_json()
    user_id = data.get('user_id')
    footprint = data.get('footprint')

    if not all([user_id, footprint]):
        return jsonify({'error': 'Missing fields'}), 400

    try:
        response = supabase.table('carbon_footprints').insert({
            'user_id': user_id,
            'footprint': float(footprint)
        }).execute()
        return jsonify({'message': 'Footprint added'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/carbon-footprint/<user_id>', methods=['GET'])
def get_carbon_footprints(user_id):
    try:
        response = supabase.table('carbon_footprints').select('*').eq('user_id', user_id).execute()
        return jsonify({'footprints': response.data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)