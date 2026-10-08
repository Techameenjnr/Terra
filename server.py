from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os


ROOT = os.path.dirname(os.path.abspath(__file__))


def main():
    port = int(os.environ.get("PORT", "8000"))
    handler = partial(SimpleHTTPRequestHandler, directory=ROOT)
    httpd = ThreadingHTTPServer(("0.0.0.0", port), handler)
    print(f"Serving Terra Quiz at http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
