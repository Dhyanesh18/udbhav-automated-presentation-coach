from fastapi import FastAPI, UploadFile, File, HTTPException    
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from deepgram import DeepgramClient, PrerecordedOptions, FileSource
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate

load_dotenv()

app = FastAPI(title="Presentation Coach API")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

groq_client = Groq(api_key=os.get_env("GROQ_API_KEY"))
deepgram = DeepgramClient(os.get_env("DEEPGRAM_API_KEY"))

FILLER_WORDS = ["um","like"]