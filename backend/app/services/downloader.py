import yt_dlp
import os
import uuid
from app.config import settings


def download_media(url: str, media_type: str = "video") -> str:
    """Download media from URL using yt-dlp. Returns path to downloaded file."""
    job_id = str(uuid.uuid4())[:8]
    output_dir = os.path.join(settings.DATA_DIR, f"dl_{job_id}")
    os.makedirs(output_dir, exist_ok=True)

    if media_type == "audio":
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": os.path.join(output_dir, "%(title)s.%(ext)s"),
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "wav",
                    "preferredquality": "192",
                }
            ],
            "quiet": True,
        }
    else:
        ydl_opts = {
            "format": "bestvideo[ext=mp4]+bestaudio/best[ext=mp4]/best",
            "outtmpl": os.path.join(output_dir, "%(title)s.%(ext)s"),
            "quiet": True,
        }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    # Find the downloaded file
    files = os.listdir(output_dir)
    if not files:
        raise FileNotFoundError(f"No file downloaded to {output_dir}")

    return os.path.join(output_dir, files[0])
