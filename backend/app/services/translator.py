import requests
from app.config import settings


def translate_text(text: str, target_lang: str, source_lang: str = "auto") -> str:
    """Translate text using LibreTranslate API."""
    payload = {
        "q": text,
        "source": source_lang if source_lang != "auto" else "auto",
        "target": target_lang,
        "format": "text",
    }
    try:
        resp = requests.post(
            f"{settings.LIBRETRANSLATE_URL}/translate",
            json=payload,
            timeout=60,
        )
        resp.raise_for_status()
        return resp.json()["translatedText"]
    except Exception as e:
        # Fallback: return original text if LibreTranslate is not available
        print(f"[Translator] LibreTranslate unavailable: {e}. Returning original text.")
        return text


def translate_segments(segments: list, target_lang: str, source_lang: str = "auto") -> list:
    """Translate a list of transcript segments."""
    translated = []
    for seg in segments:
        translated_text = translate_text(seg["text"], target_lang, source_lang)
        translated.append({**seg, "text": translated_text})
    return translated
