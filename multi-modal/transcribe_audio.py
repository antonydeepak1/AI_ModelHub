import os

# ✅ Add FFmpeg to PATH for this session (required by Whisper)
os.environ["PATH"] += os.pathsep + r"D:\Downloads\ffmpeg-7.0.2-essentials_build\ffmpeg-7.0.2-essentials_build\bin"

import torch
import whisper  # OpenAI's Whisper
from transformers import pipeline as hf_pipeline  # Avoids conflict with other 'pipeline'

# ✅ Helper: Convert seconds to mm:ss
def format_timestamp_mmss(seconds):
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes:02d}:{secs:02d}"

def transcribe_and_translate_audio(audio_path):
    """Transcribes audio using Whisper, returns timestamped segments and language."""
    
    if not audio_path or not os.path.exists(audio_path):
        print(f"Audio file not found or path is invalid: {audio_path}")
        return None, None, None

    print("Loading Whisper model for transcription...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = whisper.load_model("base").to(device)

    print(f"Transcribing audio file: {audio_path} (this may take a while)...")
    result = model.transcribe(audio_path, verbose=False)

    detected_language = result.get("language", "unknown")
    segments = result.get("segments", [])
    transcript_with_timestamps = []
    full_transcription = ""
    concept_switches = []

    print(f"\n--- Transcription ---")
    print(f"Detected language: {detected_language}")

    previous_end = 0
    for segment in segments:
        start = segment['start']
        end = segment['end']
        text = segment['text'].strip()
        full_transcription += text + " "
        transcript_with_timestamps.append((start, end, text))

        # ✅ Detect concept switch (pause > 5s)
        if start - previous_end > 5:
            concept_switches.append((start, text))
        previous_end = end

    # ✅ Group by 1-minute intervals
    print("\n--- Timestamped Summary Blocks ---")
    grouped_segments = {}
    for start, end, text in transcript_with_timestamps:
        start_min = int(start // 60)
        end_min = int(end // 60)

        # Group each segment into all minutes it touches
        for minute in range(start_min, end_min + 1):
            if minute not in grouped_segments:
                grouped_segments[minute] = []
            grouped_segments[minute].append(text)

    # ✅ Format output
    sorted_minutes = sorted(grouped_segments.keys())
    timestamped_blocks = []
    for minute in sorted_minutes:
        block_start = format_timestamp_mmss(minute * 60)
        block_end = format_timestamp_mmss((minute + 1) * 60)
        text_block = ' '.join(grouped_segments[minute]).strip()
        timestamped_blocks.append(f"[{block_start} – {block_end}]\n{text_block}\n")

    # ✅ Print and return final timestamped output
    for block in timestamped_blocks:
        print(block)

    # ✅ Translate if needed
    if detected_language != "en" and full_transcription.strip():
        print("\nTranslating transcription to English...")
        try:
            translator = hf_pipeline("translation", model="Helsinki-NLP/opus-mt-mul-en", device=0 if torch.cuda.is_available() else -1)
            char_chunk_size = 400
            text_chunks = [full_transcription[i:i+char_chunk_size] for i in range(0, len(full_transcription), char_chunk_size)]

            translated_text_parts = []
            for i, chunk in enumerate(text_chunks):
                if chunk.strip():
                    translated_chunk_result = translator(chunk, truncation=True)
                    if translated_chunk_result and isinstance(translated_chunk_result, list) and translated_chunk_result[0].get('translation_text'):
                        translated_text_parts.append(translated_chunk_result[0]['translation_text'])
                    else:
                        print(f"Warning: Translation of chunk {i+1} failed or was empty.")
                        translated_text_parts.append(chunk)

            english_transcription = ' '.join(translated_text_parts)
            return english_transcription, detected_language, timestamped_blocks  # ✅ return modified output

        except Exception as e:
            print(f"Error during translation: {e}. Using original transcription.")
            return full_transcription.strip(), detected_language, timestamped_blocks
    else:
        return full_transcription.strip(), detected_language, timestamped_blocks  # ✅ return modified output
