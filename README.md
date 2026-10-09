# Terra Trivia

Terra Trivia is a Python-based quiz web app with a clean, modern interface, account sign-in, leaderboard tracking, and category-based trivia challenges.

## Features

- Sign in and create account flows
- SQLite-backed auth and session handling
- Multiple trivia categories including Python
- Difficulty filters and adjustable question counts
- Live leaderboard with saved scores
- Mobile-friendly responsive layout
- Flask app ready for deployment

## Tech stack

- Python
- Flask
- SQLite
- HTML
- CSS
- JavaScript

## Local setup

1. Create a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the app:
   ```bash
   python main.py
   ```

4. Open the app in a browser:
   ```text
   http://localhost:5000
   ```

## Demo account

- Email: demo@terra.com
- Password: demo123

## Deployment

The project includes deployment configuration for a Python hosting stack using:

- `Procfile`
- `render.yaml`
- `requirements.txt`

## Project structure

- `main.py` - app entry point
- `server.py` - Flask app, routes, SQLite logic
- `index.html` - page structure
- `styles.css` - styling and responsive layout
- `script.js` - client-side interactions
- `trivia.db` - local SQLite database

## License

This project is provided as-is for educational and demo purposes.
