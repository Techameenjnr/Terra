# Terra Trivia

Terra Trivia is a Python-based quiz web app with a clean, modern interface, account sign-in, leaderboard tracking, and category-based trivia challenges.

## Features

- Sign in and create account flows
- SQLite-backed auth and session handling
- Passwords are hashed; signup requires a valid email and an 8-character password
- Multiple trivia categories including Python
- Difficulty filters and adjustable question counts
- Server-issued questions and server-verified answers/scores
- Signed-in leaderboard submissions generated only from completed quiz attempts
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

3. Configure local settings by copying `.env.example` to `.env` and setting a unique `SECRET_KEY`. The app reads environment variables; load `.env` in your shell or configure them in your IDE.

4. Run the app:
   ```bash
   python main.py
   ```

5. Open the app in a browser:
   ```text
   http://localhost:5000
   ```

## Demo account

- Email: demo@terra.com
- Password: demo123

The demo account is only created and shown in development mode. It is disabled in production.

## Deployment

The repository includes Render deployment configuration in `render.yaml`. It creates a 1 GB persistent disk at `/var/data`, configures SQLite at `/var/data/trivia.db`, generates a `SECRET_KEY`, and sets production cookie settings automatically. The service uses Render's paid Starter plan because persistent disks are not available on the free plan; review current pricing before deployment.

**Database persistence:** SQLite is suitable for this single-instance app. Render's persistent disk protects accounts and scores across deploys and restarts. Keep the app on one instance while using SQLite; scaling to multiple instances requires a managed database such as PostgreSQL.

The app refuses to start in production without a `SECRET_KEY`. Do not commit `.env` files, real secrets, or database files.

## Tests

Run the backend tests with:

```bash
python -m unittest discover -s tests -v
```

## Project structure

- `main.py` - app entry point
- `server.py` - Flask app, routes, SQLite logic
- `questions.py` - server-side question bank and quiz selection
- `index.html` - page structure
- `styles.css` - styling and responsive layout
- `script.js` - client-side interactions
- `tests/test_server.py` - auth, quiz scoring, and leaderboard tests
- `trivia.db` - generated local SQLite database (not tracked by Git)

## License

This project is provided as-is for educational and demo purposes.
