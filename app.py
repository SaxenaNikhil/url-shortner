from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import shortuuid
import validators
from datetime import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///url_shortener.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

class URL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(500), nullable=False)
    short_code = db.Column(db.String(10), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    clicks = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<URL {self.short_code}>'

def generate_short_code():
    """Generate a unique short code for URLs"""
    while True:
        code = shortuuid.ShortUUID().random(length=6)
        if not URL.query.filter_by(short_code=code).first():
            return code

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/api/shorten', methods=['POST'])
def shorten_url():
    """API endpoint to shorten a URL"""
    try:
        data = request.get_json()
        original_url = data.get('url', '').strip()
        
        if not original_url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Validate URL
        if not validators.url(original_url):
            return jsonify({'error': 'Invalid URL format'}), 400
        
        # Check if URL already exists
        existing_url = URL.query.filter_by(original_url=original_url).first()
        if existing_url:
            return jsonify({
                'short_url': request.host_url + existing_url.short_code,
                'original_url': existing_url.original_url,
                'short_code': existing_url.short_code,
                'clicks': existing_url.clicks
            })
        
        # Create new shortened URL
        short_code = generate_short_code()
        new_url = URL(original_url=original_url, short_code=short_code)
        
        db.session.add(new_url)
        db.session.commit()
        
        short_url = request.host_url + short_code
        
        return jsonify({
            'short_url': short_url,
            'original_url': original_url,
            'short_code': short_code,
            'clicks': 0
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/<short_code>')
def redirect_to_original(short_code):
    """Redirect short code to original URL"""
    url_record = URL.query.filter_by(short_code=short_code).first()
    
    if url_record:
        # Increment click count
        url_record.clicks += 1
        db.session.commit()
        
        return redirect(url_record.original_url)
    else:
        return render_template('404.html'), 404

@app.route('/api/stats/<short_code>')
def get_url_stats(short_code):
    """Get statistics for a shortened URL"""
    url_record = URL.query.filter_by(short_code=short_code).first()
    
    if url_record:
        return jsonify({
            'original_url': url_record.original_url,
            'short_code': url_record.short_code,
            'clicks': url_record.clicks,
            'created_at': url_record.created_at.isoformat()
        })
    else:
        return jsonify({'error': 'URL not found'}), 404

@app.route('/api/recent')
def get_recent_urls():
    """Get recently created URLs"""
    recent_urls = URL.query.order_by(URL.created_at.desc()).limit(10).all()
    
    urls = []
    for url in recent_urls:
        urls.append({
            'short_url': request.host_url + url.short_code,
            'original_url': url.original_url,
            'short_code': url.short_code,
            'clicks': url.clicks,
            'created_at': url.created_at.isoformat()
        })
    
    return jsonify(urls)

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=3000)


