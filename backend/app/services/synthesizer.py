import asyncio
import edge_tts
import os


# Edge TTS voice map by language code
VOICE_MAP = {
    "en": "en-US-AriaNeural",
    "ar": "ar-EG-SalmaNeural",
    "zh": "zh-CN-XiaoxiaoNeural",
    "fr": "fr-FR-DeniseNeural",
    "de": "de-DE-KatjaNeural",
    "hi": "hi-IN-SwaraNeural",
    "id": "id-ID-GadisNeural",
    "it": "it-IT-ElsaNeural",
    "ja": "ja-JP-NanamiNeural",
    "ko": "ko-KR-SunHiNeural",
    "ms": "ms-MY-YasminNeural",
    "nl": "nl-NL-ColetteNeural",
    "pl": "pl-PL-ZofiaNeural",
    "pt": "pt-BR-FranciscaNeural",
    "ru": "ru-RU-SvetlanaNeural",
    "es": "es-ES-ElviraNeural",
    "sv": "sv-SE-SofieNeural",
    "tr": "tr-TR-EmelNeural",
    "uk": "uk-UA-PolinaNeural",
    "ur": "ur-PK-UzmaNeural",
}


async def _synthesize(text: str, voice: str, output_path: str):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)


def synthesize(text: str, target_lang: str, output_path: str) -> str:
    """Generate speech using Edge TTS. Returns path to audio file."""
    voice = VOICE_MAP.get(target_lang, "en-US-AriaNeural")
    asyncio.run(_synthesize(text, voice, output_path))
    return output_path
