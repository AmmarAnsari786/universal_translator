from faster_whisper import WhisperModel

# Use "base" model for fast results; can be upgraded to "medium" or "large-v3"
_model = None


def get_model():
    global _model
    if _model is None:
        _model = WhisperModel("base", device="cpu", compute_type="int8")
    return _model


def transcribe(audio_path: str, source_language: str = None) -> dict:
    """
    Transcribe audio using faster-whisper.
    Returns dict with 'text', 'segments', and 'language'.
    """
    model = get_model()
    lang = None if source_language == "auto" else source_language

    segments, info = model.transcribe(audio_path, language=lang, beam_size=5)

    full_text = ""
    segment_list = []
    for segment in segments:
        full_text += segment.text + " "
        segment_list.append(
            {"start": segment.start, "end": segment.end, "text": segment.text}
        )

    return {
        "text": full_text.strip(),
        "segments": segment_list,
        "language": info.language,
    }
