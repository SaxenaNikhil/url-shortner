#!/usr/bin/env python3
"""
URL Shortener - Startup Script
Run this file to start the URL shortener application
"""

import os
import sys
from app import app

if __name__ == '__main__':
    # Use PORT environment variable for deployment, fallback to 3000 for local development
    port = int(os.environ.get('PORT', 3000))
    
    print("🚀 Starting URL Shortener...")
    print(f"📱 Open your browser and go to: http://localhost:{port}")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        app.run(debug=True, host='0.0.0.0', port=port)
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Goodbye!")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)
