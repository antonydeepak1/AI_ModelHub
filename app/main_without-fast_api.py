# main_cli.py
import os

# Import functions from our modules
from setup import setup_nltk_resources, suppress_warnings_function
from download_audio import download_audio_from_youtube_local
from transcribe_audio import transcribe_and_translate_audio
from summarize_text import summarize_text_local
from ner import perform_ner_local
from keyword_extraction import extract_keywords_local
from topic_modeling import perform_topic_modeling_local

def main_pipeline():
    """Main function to run the podcast processing pipeline."""
    print("Initializing setup...")
    setup_nltk_resources()
    suppress_warnings_function()
    print("Setup complete.\n")

    youtube_url = input("Enter the YouTube URL of the podcast: ")
    if not youtube_url.strip():
        print("No YouTube URL provided. Exiting.")
        return

    # Use a fixed temporary name for the downloaded audio (without extension)
    temp_audio_base = "temp_podcast_processing_audio"

    try:
        # Step 1: Download Audio
        print("-" * 30)
        downloaded_audio_path = download_audio_from_youtube_local(youtube_url, temp_audio_base)
        if not downloaded_audio_path:
            print("Audio download failed. Exiting pipeline.")
            return 

        # Step 2: Transcribe and Translate (if needed)
        print("-" * 30)
        english_transcription, original_detected_lang, timestamp_segments = transcribe_and_translate_audio(downloaded_audio_path)
        if not english_transcription:
            print("Transcription failed or produced no text. Exiting pipeline.")
            return
        
        text_to_process = english_transcription

        # Step 3: Summarize
        print("-" * 30)
        summarize_text_local(text_to_process, target_words=150)

        # Step 4: Named Entity Recognition
        print("-" * 30)
        perform_ner_local(text_to_process)

        # Step 5: Keyword Extraction
        print("-" * 30)
        extract_keywords_local(text_to_process, num_keywords=10)

        # Step 6: Topic Modeling
        print("-" * 30)
        perform_topic_modeling_local(text_to_process, num_topics=5, num_words_per_topic=5)

    except Exception as e:
        print(f"\nA critical error occurred in the main processing pipeline: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # Clean up the downloaded audio file
        final_audio_path = temp_audio_base + ".mp3"
        if os.path.exists(final_audio_path):
            try:
                os.remove(final_audio_path)
                print(f"\nTemporary audio file '{final_audio_path}' has been deleted.")
            except Exception as e_del:
                print(f"Error deleting temporary audio file '{final_audio_path}': {e_del}")
        print("-" * 30)
        print("Pipeline processing finished.")

if __name__ == '__main__':
    main_pipeline()