import spacy

def perform_ner_local(text_for_ner):
    """Performs NER using SpaCy."""
    if not text_for_ner or not text_for_ner.strip():
        print("No text provided for NER.")
        return []
        
    print("\n--- Named Entity Recognition ---")
    print("Loading SpaCy model (en_core_web_sm) for NER...")
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        print("Spacy 'en_core_web_sm' model not found. Please run:")
        print("python -m spacy download en_core_web_sm")
        return []
        
    doc = nlp(text_for_ner)
    entities = [(entity.text, entity.label_) for entity in doc.ents]
    # Use a set to get unique entity-label pairs, then convert back to list and sort
    unique_entities = sorted(list(set(entities))) 

    print("Extracted Entities:")
    if unique_entities:
        for entity_text, entity_label in unique_entities:
            print(f"  Entity: {entity_text}, Label: {entity_label}")
    else:
        print("  No entities found.")
    return unique_entities