import re
from gensim import corpora
from gensim.models import LdaModel
from gensim.parsing.preprocessing import STOPWORDS # Gensim's own stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords as nltk_stopwords # NLTK's stopwords
from nltk.stem import WordNetLemmatizer

# Module-level cache for NLP objects to avoid re-initialization
_stop_words_set_tm = None
_wordnet_lemmatizer_tm = None

def preprocess_text_for_topic_modeling(text_for_lda):
    """Preprocesses a single string of text for LDA."""
    global _stop_words_set_tm, _wordnet_lemmatizer_tm
    
    if _stop_words_set_tm is None:
        # Combine NLTK and Gensim stopwords for a more comprehensive set
        _stop_words_set_tm = set(nltk_stopwords.words('english')).union(STOPWORDS)
    if _wordnet_lemmatizer_tm is None:
        _wordnet_lemmatizer_tm = WordNetLemmatizer()

    tokens = word_tokenize(text_for_lda.lower())
    tokens = [
        word for word in tokens 
        if word.isalpha() and word not in _stop_words_set_tm and len(word) > 2 # Basic filtering
    ]
    tokens = [_wordnet_lemmatizer_tm.lemmatize(word) for word in tokens]
    return tokens

def preprocess_and_split_for_topic_modeling(transcription_text):
    """Splits transcription into sentences and preprocesses each for topic modeling."""
    if not transcription_text or not transcription_text.strip():
        return []
    
    # Use NLTK's sent_tokenize for more robust sentence splitting
    sentences = sent_tokenize(transcription_text)
    processed_docs = [preprocess_text_for_topic_modeling(sentence) for sentence in sentences]
    # Filter out any empty lists of tokens that might result from very short sentences
    # or sentences consisting only of stopwords/short words.
    processed_docs = [doc_tokens for doc_tokens in processed_docs if doc_tokens]
    return processed_docs

def perform_topic_modeling_local(transcription_text, num_topics=5, num_words_per_topic=5):
    """Builds an LDA model and prints topics."""
    if not transcription_text or not transcription_text.strip():
        print("No text provided for topic modeling.")
        return

    print("\n--- Topic Modeling ---")
    print("Preprocessing text for topic modeling...")
    # Each "document" for LDA will be a preprocessed sentence
    processed_text_data_for_lda = preprocess_and_split_for_topic_modeling(transcription_text)

    if not processed_text_data_for_lda: # Check if list of lists of tokens is empty
        print("The corpus is empty after preprocessing all sentences. Cannot perform topic modeling.")
        return

    print("Building LDA model...")
    try:
        dictionary = corpora.Dictionary(processed_text_data_for_lda)
        # Filter out tokens that appear in less than 2 documents (sentences in this case)
        # or in more than 50% of the documents (too common). Adjust as needed.
        dictionary.filter_extremes(no_below=2, no_above=0.5)
        
        # If dictionary becomes empty after filtering
        if not dictionary:
            print("Dictionary is empty after filtering extremes. Text might be too short or homogeneous.")
            return

        corpus = [dictionary.doc2bow(text_tokens) for text_tokens in processed_text_data_for_lda]
        # Filter out any documents that became empty after dictionary filtering (if tokens were removed)
        corpus = [doc for doc in corpus if doc]


        if not corpus:
            print("The corpus is empty after creating Bag-of-Words with the filtered dictionary.")
            print("This might happen if the text is too short or too homogeneous for the given filters.")
            return

        # Build LDA model
        lda_model = LdaModel(
            corpus=corpus,
            num_topics=num_topics,
            id2word=dictionary,
            passes=20,          # Number of passes through the corpus during training
            iterations=100,     # Max number of iterations through the corpus
            alpha='auto',       # Learn alpha from data
            eta='auto',         # Learn eta from data
            random_state=42     # For reproducibility
        )

        print(f"\nExtracted Topics (Top {num_words_per_topic} words per topic):")
        topics = lda_model.print_topics(num_topics=num_topics, num_words=num_words_per_topic)
        if topics:
            for topic_id, topic_words_str in topics:
                # Parsing the string like '0.015*"word1" + 0.012*"word2"' to get just words
                topic_words_list = [word.split('*"')[1].replace('"', '') for word in topic_words_str.split(' + ')]
                print(f"  Topic {topic_id}: {', '.join(topic_words_list)}")
        else:
            print("  No topics could be extracted with the current settings/data.")
            
    except ValueError as ve:
        print(f"Error during topic modeling (ValueError): {ve}")
        print("This often means the text was too short, or filtering was too aggressive for LDA.")
    except Exception as e:
        print(f"An unexpected error occurred during topic modeling: {e}")