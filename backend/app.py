from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from groq import Groq
from deepgram import DeepgramClient
import os
from dotenv import load_dotenv
import tempfile
import re
from typing import Dict, List, Optional
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from passlib.hash import argon2
from jose import JWTError, jwt
from datetime import datetime, timedelta
from bson import ObjectId
import httpx

load_dotenv()

app = FastAPI(title="Presentation Coach API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
deepgram = DeepgramClient(api_key=os.getenv("DEEPGRAM_API_KEY"))

# MongoDB setup
mongo_client = MongoClient(os.getenv("MONGODB_URI"))
db = mongo_client["presentation_coach_db"]
users_collection = db["users"]
sessions_collection = db["sessions"]
recordings_collection = db["recordings"]

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080

FILLER_WORDS = ["um", "uh", "like", "so", "you know", "basically", "actually", "kind of", "sort of", "i mean"]

# Pydantic models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SessionCreate(BaseModel):
    name: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Auth functions
def verify_password(plain_password, hashed_password):
    return argon2.verify(plain_password, hashed_password)

def get_password_hash(password):
    return argon2.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = users_collection.find_one({"email": email})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Auth endpoints
@app.post("/api/auth/register", response_model=Token)
async def register(user: UserRegister):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_doc = {
        "email": user.email,
        "password": hashed_password,
        "name": user.name,
        "created_at": datetime.utcnow()
    }
    users_collection.insert_one(user_doc)
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"email": current_user["email"], "name": current_user["name"]}

# Session endpoints
@app.post("/api/sessions")
async def create_session(session: SessionCreate, current_user: dict = Depends(get_current_user)):
    session_doc = {
        "user_id": str(current_user["_id"]),
        "name": session.name,
        "created_at": datetime.utcnow()
    }
    result = sessions_collection.insert_one(session_doc)
    return {"id": str(result.inserted_id), "name": session.name, "created_at": session_doc["created_at"]}

@app.get("/api/sessions")
async def get_sessions(current_user: dict = Depends(get_current_user)):
    sessions = list(sessions_collection.find({"user_id": str(current_user["_id"])}).sort("created_at", -1))
    return [
        {
            "id": str(s["_id"]),
            "name": s["name"],
            "created_at": s["created_at"]
        }
        for s in sessions
    ]

@app.get("/api/sessions/{session_id}/recordings")
async def get_session_recordings(session_id: str, current_user: dict = Depends(get_current_user)):
    # Verify session belongs to user
    session = sessions_collection.find_one({"_id": ObjectId(session_id), "user_id": str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    recordings = list(recordings_collection.find({"session_id": session_id}).sort("created_at", -1))
    return [
        {
            "id": str(r["_id"]),
            "metrics": r["metrics"],
            "ai_feedback": r["ai_feedback"],
            "created_at": r["created_at"]
        }
        for r in recordings
    ]

def transcribe_audio(audio_file_path: str) -> Dict:
    try:
        with open(audio_file_path, "rb") as audio:
            buffer_data = audio.read()
        
        url = "https://api.deepgram.com/v1/listen"
        params = {"model": "nova-2", "smart_format": "true", "punctuate": "true"}
        headers = {
            "Authorization": f"Token {os.getenv('DEEPGRAM_API_KEY')}",
            "Content-Type": "audio/*"
        }
        
        response = httpx.post(url, params=params, headers=headers, content=buffer_data, timeout=60.0)
        response.raise_for_status()
        
        data = response.json()
        result = data["results"]["channels"][0]["alternatives"][0]
        transcript_text = result["transcript"]
        
        words = []
        if "words" in result:
            for word in result["words"]:
                words.append({"word": word["word"], "start": word["start"], "end": word["end"]})
        
        return {"text": transcript_text, "words": words, "duration": words[-1]["end"] if words else 0}
    except Exception as e:
        raise Exception(f"Transcription failed: {str(e)}")

def analyze_transcript(transcript_text: str, words_with_timestamps: List[Dict]) -> Dict:
    filler_counts = {}
    transcript_lower = transcript_text.lower()
    
    for filler in FILLER_WORDS:
        pattern = r'\b' + re.escape(filler) + r'\b'
        count = len(re.findall(pattern, transcript_lower))
        if count > 0:
            filler_counts[filler] = count
    
    total_fillers = sum(filler_counts.values())
    
    if words_with_timestamps and len(words_with_timestamps) > 0:
        duration_seconds = words_with_timestamps[-1].get('end', 0)
        duration_minutes = duration_seconds / 60
        total_words = len(transcript_text.split())
        wpm = total_words / duration_minutes if duration_minutes > 0 else 0
    else:
        duration_seconds = 0
        wpm = 0
    
    if wpm < 120:
        pace_feedback = "Too slow - aim for 120-160 WPM"
    elif wpm > 160:
        pace_feedback = "Too fast - slow down to 120-160 WPM"
    else:
        pace_feedback = "Good pace!"
    
    long_pauses = []
    if words_with_timestamps and len(words_with_timestamps) > 1:
        for i in range(len(words_with_timestamps) - 1):
            current = words_with_timestamps[i]
            next_word = words_with_timestamps[i + 1]
            gap = next_word.get('start', 0) - current.get('end', 0)
            if gap > 2.0:
                long_pauses.append({
                    'timestamp': current.get('end', 0),
                    'duration': round(gap, 2),
                    'after_word': current.get('word', '')
                })
    
    clarity_score = 10.0
    clarity_score -= min(total_fillers / 2, 4)
    if wpm < 120 or wpm > 160:
        clarity_score -= 2
    clarity_score -= min(len(long_pauses) * 0.5, 2)
    clarity_score = max(1.0, min(10.0, clarity_score))
    
    pacing_segments = []
    if words_with_timestamps and len(words_with_timestamps) > 10:
        segment_duration = 10
        current_segment_words = []
        segment_start = 0
        
        for word in words_with_timestamps:
            if word.get('start', 0) - segment_start >= segment_duration:
                if current_segment_words:
                    segment_wpm = (len(current_segment_words) / segment_duration) * 60
                    pacing_segments.append({'time': int(segment_start), 'wpm': round(segment_wpm, 1)})
                current_segment_words = []
                segment_start = word.get('start', 0)
            current_segment_words.append(word)
        
        if current_segment_words and words_with_timestamps:
            remaining_duration = words_with_timestamps[-1].get('end', 0) - segment_start
            if remaining_duration > 0:
                segment_wpm = (len(current_segment_words) / remaining_duration) * 60
                pacing_segments.append({'time': int(segment_start), 'wpm': round(segment_wpm, 1)})
    
    return {
        "transcript": transcript_text,
        "duration": round(duration_seconds, 1),
        "filler_words": filler_counts,
        "total_fillers": total_fillers,
        "words_per_minute": round(wpm, 1),
        "pace_feedback": pace_feedback,
        "long_pauses": long_pauses,
        "clarity_score": round(clarity_score, 1),
        "pacing_segments": pacing_segments
    }

def generate_ai_feedback(metrics: Dict, previous_feedbacks: List[Dict]) -> str:
    transcript_excerpt = metrics['transcript'][:500] + "..." if len(metrics['transcript']) > 500 else metrics['transcript']
    
    # Build context from previous recordings
    context = ""
    if previous_feedbacks:
        context = "\n\nPREVIOUS SESSION RECORDINGS:\n"
        for i, prev in enumerate(previous_feedbacks[-3:], 1):  # Last 3 recordings
            context += f"\nRecording {i}:\n"
            context += f"- WPM: {prev['metrics']['words_per_minute']}\n"
            context += f"- Filler words: {prev['metrics']['total_fillers']}\n"
            context += f"- Clarity: {prev['metrics']['clarity_score']}/10\n"
            context += f"Previous feedback: {prev['ai_feedback'][:200]}...\n"
    
    prompt = f"""You are an expert presentation coach tracking a student's progress across multiple practice sessions.

CURRENT RECORDING METRICS:
• Duration: {metrics['duration']} seconds
• Filler Words: {metrics['total_fillers']} instances
• Speaking Pace: {metrics['words_per_minute']} WPM (ideal: 120-160)
• Long Pauses: {len(metrics['long_pauses'])} instances
• Clarity Score: {metrics['clarity_score']}/10

TRANSCRIPT EXCERPT:
{transcript_excerpt}
{context}

{"Compare this recording to previous attempts. Highlight specific improvements or regressions." if previous_feedbacks else "Provide 3-4 specific, actionable tips to improve this presentation."} Be encouraging but honest."""

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a professional presentation coach tracking student progress over time."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Unable to generate AI feedback: {str(e)}"

@app.post("/api/sessions/{session_id}/analyze")
async def analyze_audio(
    session_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    # Verify session belongs to user
    session = sessions_collection.find_one({"_id": ObjectId(session_id), "user_id": str(current_user["_id"])})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    temp_path = None
    try:
        allowed_extensions = ['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm']
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail=f"Unsupported file type")
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        # Get previous recordings for context
        previous_recordings = list(recordings_collection.find({"session_id": session_id}).sort("created_at", -1).limit(3))
        
        transcription = transcribe_audio(temp_path)
        metrics = analyze_transcript(transcription["text"], transcription["words"])
        ai_feedback = generate_ai_feedback(metrics, previous_recordings)
        
        # Save recording
        recording_doc = {
            "session_id": session_id,
            "user_id": str(current_user["_id"]),
            "metrics": metrics,
            "ai_feedback": ai_feedback,
            "created_at": datetime.utcnow()
        }
        recordings_collection.insert_one(recording_doc)
        
        return {**metrics, "ai_feedback": ai_feedback}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except:
                pass

@app.get("/")
async def root():
    return {"message": "Presentation Coach API", "status": "healthy"}

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "groq_configured": bool(os.getenv("GROQ_API_KEY")),
        "deepgram_configured": bool(os.getenv("DEEPGRAM_API_KEY")),
        "mongodb_configured": bool(os.getenv("MONGODB_URI"))
    }