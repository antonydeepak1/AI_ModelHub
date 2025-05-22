import nltk
import warnings

def setup_nltk_resources():
    """Downloads necessary NLTK resources if not already present."""
    resources_info = [
        ('corpora', 'stopwords'),
        ('tokenizers', 'punkt'), # punkt is under tokenizers
        ('corpora', 'wordnet')
    ]
    print("Checking/downloading NLTK resources...")
    for type_path, resource_name in resources_info:
        try:
            nltk.data.find(f'{type_path}/{resource_name}')
            # print(f"NLTK resource '{resource_name}' found.")
        except LookupError:
            print(f"NLTK resource '{resource_name}' not found. Downloading...")
            nltk.download(resource_name, quiet=True)
    print("NLTK resources setup complete.")

def suppress_warnings_function():
    """Suppresses common warnings."""
    warnings.filterwarnings("ignore", category=UserWarning, module='torch.utils.data')
    warnings.filterwarnings("ignore", category=FutureWarning)
    warnings.filterwarnings("ignore", message="Some weights of the model checkpoint .* were not used when initializing .*")
    warnings.filterwarnings("ignore", message=".*is using a deprecated way to call WordNetcorpus.*")
    print("Common warnings suppressed.")

if __name__ == '__main__':
    # This allows running setup independently if needed, but main_cli.py will call these.
    setup_nltk_resources()
    suppress_warnings_function()
    print("Setup script finished.")
