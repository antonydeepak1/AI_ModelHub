



import os
import torch
import whisper
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline as hf_pipeline
from setup import setup_nltk_resources, suppress_warnings_function
from download_audio import download_audio_from_youtube_local
from summarize_text import summarize_text_local
from ner import perform_ner_local
from keyword_extraction import extract_keywords_local
from topic_modeling import perform_topic_modeling_local

import nest_asyncio
import uvicorn
from pyngrok import ngrok

# Initialize FastAPI app
app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup FFMPEG path
os.environ["PATH"] += os.pathsep + r"D:\Downloads\ffmpeg-7.0.2-essentials_build\ffmpeg-7.0.2-essentials_build\bin"

# Load Whisper and Summarizer once
device = "cuda" if torch.cuda.is_available() else "cpu"
whisper_model = whisper.load_model("base").to(device)
summarizer = hf_pipeline("summarization", model="t5-small", device=0 if torch.cuda.is_available() else -1)

# Helper for timestamp formatting
def format_timestamp(seconds):
    minutes = int(seconds // 60)
    seconds = int(seconds % 60)
    return f"{minutes:02d}:{seconds:02d}"

# Request body structure
class YouTubeURL(BaseModel):
    url: str

@app.post("/analyze/")
def analyze_youtube_podcast(data: YouTubeURL):
    youtube_url = data.url.strip()
    setup_nltk_resources()
    suppress_warnings_function()

    if not youtube_url:
        return {"error": "❌ Please provide a YouTube URL."}

    temp_audio = "temp_podcast_processing_audio"
    audio_path = None

    try:
        # Step 1: Download audio
        audio_path = download_audio_from_youtube_local(youtube_url, temp_audio)
        if not audio_path:
            return {"error": "❌ Failed to download audio."}

        # Step 2: Transcribe and summarize
        result = whisper_model.transcribe(audio_path, verbose=False)
        segments = result.get("segments", [])
        full_text = ""
        chapter_map = {}

        for seg in segments:
            minute = int(seg["start"] // 60)
            chapter_map.setdefault(minute, []).append(seg["text"].strip())
            full_text += seg["text"].strip() + " "

        chapters = []
        for idx, minute in enumerate(sorted(chapter_map.keys())):
            block_text = " ".join(chapter_map[minute])
            timestamp = format_timestamp(minute * 60)
            try:
                summary = summarizer(block_text, max_length=25, min_length=8, do_sample=False)[0]['summary_text'].strip()
            except:
                summary = block_text[:80] + "..."
            chapters.append(f"{idx+1}. {summary} ({timestamp})")

        # Step 3: Additional NLP tasks (optional)
        _ = summarize_text_local(full_text, target_words=150)
        _ = perform_ner_local(full_text)
        _ = extract_keywords_local(full_text, num_keywords=10)
        _ = perform_topic_modeling_local(full_text, num_topics=5, num_words_per_topic=5)

        return {
            "full_transcript": full_text.strip(),
            "chapter_summary": "\n".join(chapters)
        }

    except Exception as e:
        import traceback
        return {"error": str(e), "trace": traceback.format_exc()}

    finally:
        if audio_path and os.path.exists(audio_path):
            os.remove(audio_path)

@app.get("/")
def home():
    return {"message": "Welcome to the YouTube Podcast Whisper Analyzer API!"}

# Run FastAPI with ngrok
if __name__ == "__main__":
    import sys

    # Step 1: Ngrok Authentication
    authtoken = input("Please enter your Ngrok authtoken: ").strip()
    if not authtoken:
        print("❌ Ngrok authtoken is required. Get it from: https://dashboard.ngrok.com/get-started/your-authtoken")
        sys.exit(1)

    ngrok.set_auth_token(authtoken)

    # Step 2: Create public URL
    ngrok_tunnel = ngrok.connect(8001, "http")
    ngrok_url = ngrok_tunnel.public_url
    print("🔗 FastAPI running on:", ngrok_url)

    # Step 3: Start server
    nest_asyncio.apply()
    uvicorn.run(app, host="0.0.0.0", port=8001)












