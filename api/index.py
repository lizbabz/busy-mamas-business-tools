import os
import sys

# Ensure parent directory is in Python path to import server logic
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from server import AppHandler

class handler(AppHandler):
    """Vercel Python serverless function handler."""
    pass
