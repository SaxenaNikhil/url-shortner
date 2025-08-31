# URL Shortener

A modern, fully functional URL shortener built with Python Flask and a beautiful responsive frontend.

## Features

- 🚀 **Fast URL Shortening**: Generate short URLs instantly
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔒 **Secure**: URL validation and secure redirects
- 📊 **Click Tracking**: Monitor how many times your links are clicked
- 💾 **Persistent Storage**: SQLite database for data persistence
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 📋 **Copy to Clipboard**: One-click copying of shortened URLs
- 📈 **Recent URLs**: View and manage recently shortened URLs
- ⌨️ **Keyboard Shortcuts**: Ctrl/Cmd + Enter to submit, Esc to clear

## Screenshots

The application features a modern, gradient-based design with:
- Clean, minimalist interface
- Responsive layout for all screen sizes
- Smooth animations and hover effects
- Toast notifications for user feedback
- Beautiful cards for displaying URLs

## Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- Virtual environment support (built into Python 3.3+)

### Setup

1. **Clone or download the project files**

2. **Create and activate virtual environment** (recommended)
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate     # On Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python run.py
   # or
   python app.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
url-shortener/
├── app.py                 # Main Flask application
├── run.py                 # Easy startup script
├── requirements.txt       # Python dependencies
├── venv/                  # Virtual environment (created after setup)
├── templates/            # HTML templates
│   ├── index.html       # Main page
│   └── 404.html         # Error page
├── static/              # Static assets
│   ├── css/
│   │   └── style.css    # Main stylesheet
│   └── js/
│       └── script.js    # Frontend JavaScript
└── README.md            # This file
```

## API Endpoints

### POST `/api/shorten`
Shorten a URL
- **Request Body**: `{"url": "https://example.com"}`
- **Response**: Shortened URL data with click count

### GET `/<short_code>`
Redirect to original URL
- **Parameters**: `short_code` - The generated short code
- **Response**: Redirects to original URL

### GET `/api/stats/<short_code>`
Get statistics for a shortened URL
- **Parameters**: `short_code` - The short code to get stats for
- **Response**: URL statistics including click count

### GET `/api/recent`
Get recently shortened URLs
- **Response**: Array of recent URLs with metadata

## Database Schema

The application uses SQLite with a single table:

```sql
CREATE TABLE url (
    id INTEGER PRIMARY KEY,
    original_url VARCHAR(500) NOT NULL,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    clicks INTEGER DEFAULT 0
);
```

## Usage

1. **Shorten a URL**:
   - Enter any valid URL in the input field
   - Click "Shorten" or press Ctrl/Cmd + Enter
   - Copy the generated short URL

2. **Access shortened URLs**:
   - Visit `http://localhost:3000/<short_code>`
   - You'll be redirected to the original URL

3. **Track clicks**:
   - Each redirect increments the click counter
   - View click statistics in the recent URLs section

## Customization

### Changing the Port
Edit `app.py` and modify the port in the last line:
```python
app.run(debug=True, host='0.0.0.0', port=8000)  # Change 3000 to your preferred port
```

### Database Configuration
To use a different database, modify the SQLAlchemy URI in `app.py`:
```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:pass@localhost/dbname'
```

### Styling
Modify `static/css/style.css` to customize colors, fonts, and layout.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- **Flask**: Web framework
- **Flask-SQLAlchemy**: Database ORM
- **Flask-CORS**: Cross-origin resource sharing
- **shortuuid**: Generate unique short codes
- **validators**: URL validation
- **python-dotenv**: Environment variable management

## Development

### Running in Development Mode
```bash
export FLASK_ENV=development
python app.py
```

### Database Reset
To reset the database, simply delete the `url_shortener.db` file and restart the application.

## Deployment

### Production Considerations
1. Set `FLASK_ENV=production`
2. Use a production WSGI server (Gunicorn, uWSGI)
3. Configure a reverse proxy (Nginx, Apache)
4. Set up HTTPS with SSL certificates
5. Use environment variables for sensitive configuration

### Environment Variables
```bash
export SECRET_KEY="your-secret-key-here"
export FLASK_ENV="production"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure the port is not already in use
4. Check that the database file is writable

## Troubleshooting

### Port Already in Use Error
If you see "Address already in use" error:
- **macOS**: Port 5000 is used by AirPlay. The app is configured to use port 3000 by default
- **Other systems**: Change the port in `app.py` or kill the process using the port

### Module Not Found Errors
If you get "No module named 'flask'" error:
1. Make sure you've activated the virtual environment:
   ```bash
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate     # On Windows
   ```
2. Install dependencies: `pip install -r requirements.txt`

### Virtual Environment Issues
- Always activate the virtual environment before running the app
- If you need to recreate the virtual environment:
  ```bash
  rm -rf venv
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  ```

## Future Enhancements

- User authentication and personal URL management
- Custom short codes
- URL expiration dates
- Analytics dashboard
- API rate limiting
- Bulk URL shortening
- QR code generation
- Social media sharing integration

---

Built with ❤️ using Flask and modern web technologies.
