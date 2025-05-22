

# unified_wrapper.py
import os
import nest_asyncio
import asyncio
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
import requests
from pyngrok import ngrok

# 🔐 Ngrok Authentication
authtoken = input("Please enter your Ngrok authtoken: ").strip()
if not authtoken:
    print("Ngrok authtoken is required. Get it from https://dashboard.ngrok.com/get-started/your-authtoken")
    exit()
ngrok.set_auth_token(authtoken)

# 🔗 Start Ngrok Tunnel
public_url = ngrok.connect(9000)
print("🔗 Unified FastAPI running on:", public_url)

# 🌐 External API URLs
COLAB_LLAVA_URL = "https://dd70-34-126-182-181.ngrok-free.app"  # LLaVA (Colab)
VSCODE_WHISPER_URL = "https://6262-120-56-228-215.ngrok-free.app"                  # Whisper (VSCode)

# ⚙️ FastAPI Initialization
app = FastAPI(title="Unified AI Model API")

@app.get("/")
def home():
    return {
        "message": "Unified API is running.",
        "ngrok_url": public_url.public_url
    }

# ✅ Input model for audio
class YouTubeRequest(BaseModel):
     url: str

# 🎧 Whisper Endpoint via JSON
@app.post("/analyze/")
def transcribe_audio(request: YouTubeRequest):
    try:
        whisper_response = requests.post(
            f"{VSCODE_WHISPER_URL}/analyze/",
            json={"url": request.url}
        )

        if whisper_response.status_code == 200:
            return whisper_response.json()
        else:
            return {"error": f"Whisper server responded with {whisper_response.status_code}"}

    except Exception as e:
        return {"error": str(e)}

# 🖼️ LLaVA Endpoint with Image + Question
@app.post("/predict/")
async def predict_image(image: UploadFile = File(...), question: str = Form("What is in the image?")):
    try:
        image_bytes = await image.read()
        files = {
            'image': (image.filename, image_bytes, image.content_type)
        }
        data = {'question': question}

        llava_response = requests.post(
            f"{COLAB_LLAVA_URL}/predict/",
            files=files,
            data=data
        )

        if llava_response.headers.get("Content-Type", "").startswith("application/json"):
            return llava_response.json()
        else:
            return {
                "error": "Invalid response from LLaVA server.",
                "status_code": llava_response.status_code,
                "text": llava_response.text
            }

    except Exception as e:
        return {"error": str(e)}

# 🌀 Jupyter/Colab Compatibility
nest_asyncio.apply()

# 🚀 Launch Uvicorn Server
if __name__ == "__main__":
    config = uvicorn.Config(app, host="0.0.0.0", port=9000)
    server = uvicorn.Server(config)
    asyncio.run(server.serve())
