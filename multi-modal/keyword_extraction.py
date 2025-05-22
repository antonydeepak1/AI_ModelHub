from keybert import KeyBERT
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

_lemmatizer_kw = None # Module-level variable for lemmatizer instance

def lemmatize_text_for_keywords(text_to_lemmatize):
    """Lemmatizes text for keyword extraction."""
    global _lemmatizer_kw
    if _lemmatizer_kw is None:
        _lemmatizer_kw = WordNetLemmatizer()
    
    tokens = word_tokenize(text_to_lemmatize)
    lemmatized_text = ' '.join([_lemmatizer_kw.lemmatize(token) for token in tokens])
    return lemmatized_text

def extract_keywords_local(text_for_keywords, num_keywords=10):
    """Extracts keywords using KeyBERT."""
    if not text_for_keywords or not text_for_keywords.strip():
        print("No text provided for keyword extraction.")
        return []

    print("\n--- Keyword Extraction ---")
    print("Loading KeyBERT model for keyword extraction...")
    try:
        kw_model = KeyBERT() # Loads default KeyBERT model
        
        # Lemmatization can sometimes help KeyBERT by reducing words to their base form
        lemmatized_transcription = lemmatize_text_for_keywords(text_for_keywords)
        
        keywords_with_scores = kw_model.extract_keywords(
            lemmatized_transcription,
            keyphrase_ngram_range=(1, 2), # Extract 1-word and 2-word phrases
            stop_words='english',         # Use built-in English stop words
            top_n=num_keywords,
            use_mmr=True,                 # Use Maximal Marginal Relevance for diverse keywords
            diversity=0.7                 # Diversity parameter for MMR (0 to 1, higher means more diverse)
        )
        print(f"Top {num_keywords} Keywords/Keyphrases (after lemmatization):")
        if keywords_with_scores:
            for keyword, score in keywords_with_scores:
                print(f"  Keyword: {keyword} (Score: {score:.4f})")
        else:
            print("  No keywords found.")
        return keywords_with_scores
    except Exception as e:
        print(f"Error during keyword extraction: {e}")
        return []