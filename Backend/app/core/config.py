from dotenv import load_dotenv
import os

DATABASE_URL = os.getenv("DATABASE_URL")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")