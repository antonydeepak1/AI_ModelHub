import os
import torch
from transformers import pipeline as hf_pipeline
from nltk.tokenize import sent_tokenize, word_tokenize

def chunk_text(text, chunk_size=1024):
    """Split text into chunks of ~chunk_size characters (rough approximation of token size)."""
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

def summarize_text_local(text_to_summarize, target_words=150):
    """Summarizes long text using BART with chunking, returns summary as a paragraph."""
    if not text_to_summarize or not text_to_summarize.strip():
        print("No text provided for summarization.")
        return "No text to summarize."

    print("\n--- Summarization ---")
    print("Loading summarization model (facebook/bart-large-cnn)...")

    try:
        device_id = 0 if torch.cuda.is_available() else -1
        summarizer_pipeline = hf_pipeline("summarization", model="facebook/bart-large-cnn", device=device_id)

        output_min_length = max(30, int(target_words * 0.5))
        output_max_length = int(target_words * 1.5)

        print(f"Summarizing text (target words: ~{target_words}, output tokens min: {output_min_length}, max: {output_max_length})...")

        text_chunks = chunk_text(text_to_summarize, chunk_size=1024)
        summaries = []

        for i, chunk in enumerate(text_chunks):
            try:
                print(f"  - Summarizing chunk {i+1}/{len(text_chunks)}")
                summary_result = summarizer_pipeline(
                    chunk,
                    max_length=output_max_length,
                    min_length=output_min_length,
                    do_sample=False,
                    truncation=True
                )
                summary_text = summary_result[0]['summary_text']
                summaries.append(summary_text)
            except Exception as chunk_error:
                print(f"    [Warning] Chunk {i+1} failed: {chunk_error}")
                continue

        final_summary = ' '.join(summaries)
        word_count = len(word_tokenize(final_summary))

        print(f"\nGenerated Final Summary ({word_count} words):")
        print(final_summary)

        return final_summary

    except ImportError:
        print("PyTorch not found. Summarization requires PyTorch.")
        return "Summarization failed: PyTorch not available."
    except Exception as e:
        print(f"Error during summarization: {e}")
        return "Summarization failed."


    except ImportError:
        print("PyTorch not found. Summarization requires PyTorch.")
        return ["Summarization failed: PyTorch not available."]
    except Exception as e:
        print(f"Error during summarization: {e}")
        return ["Summarization failed."]
