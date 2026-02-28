import subprocess
import os


def extract_audio(video_path: str) -> str:
    """Extract audio from video file. Returns path to wav file."""
    audio_path = video_path.rsplit(".", 1)[0] + "_audio.wav"
    cmd = [
        "ffmpeg", "-y", "-i", video_path,
        "-vn", "-ac", "1", "-ar", "16000",
        "-acodec", "pcm_s16le", audio_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg error: {result.stderr}")
    return audio_path


def merge_audio_video(video_path: str, new_audio_path: str, output_path: str) -> str:
    """Replace original audio with translated audio in the video."""
    cmd = [
        "ffmpeg", "-y",
        "-i", video_path,
        "-i", new_audio_path,
        "-c:v", "copy",
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-shortest",
        output_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg merge error: {result.stderr}")
    return output_path


def convert_audio(audio_path: str, output_path: str) -> str:
    """Convert audio to specified format."""
    cmd = ["ffmpeg", "-y", "-i", audio_path, output_path]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg convert error: {result.stderr}")
    return output_path
