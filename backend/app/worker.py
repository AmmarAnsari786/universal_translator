import os
import traceback
from sqlalchemy.orm import Session
from app.models.database import SessionLocal, TranslationJob, JobStatus
from app.services import downloader, transcriber, translator, synthesizer, media_processor
from app.config import settings


def update_job(db: Session, job_id: str, **kwargs):
    db.query(TranslationJob).filter(TranslationJob.id == job_id).update(kwargs)
    db.commit()


def run_translation_pipeline(job_id: str):
    db = SessionLocal()
    try:
        job = db.query(TranslationJob).filter(TranslationJob.id == job_id).first()
        if not job:
            return

        work_dir = os.path.join(settings.DATA_DIR, job_id)
        os.makedirs(work_dir, exist_ok=True)

        # Step 1: Download
        update_job(db, job_id, status=JobStatus.DOWNLOADING, progress=10)
        media_path = downloader.download_media(job.source_url, job.media_type)

        # Step 2: Extract audio (if video)
        if job.media_type == "video":
            audio_path = media_processor.extract_audio(media_path)
        else:
            audio_path = media_path

        # Step 3: Transcribe
        update_job(db, job_id, status=JobStatus.TRANSCRIBING, progress=30)
        transcript = transcriber.transcribe(audio_path, job.source_language)

        # Step 4: Translate
        update_job(db, job_id, status=JobStatus.TRANSLATING, progress=55)
        translated_text = translator.translate_text(
            transcript["text"], job.target_language, transcript["language"]
        )

        # Step 5: Synthesize TTS
        update_job(db, job_id, status=JobStatus.SYNTHESIZING, progress=75)
        tts_audio_path = os.path.join(work_dir, "tts_output.mp3")
        synthesizer.synthesize(translated_text, job.target_language, tts_audio_path)

        # Step 6: Merge (if video) or return audio
        update_job(db, job_id, status=JobStatus.MERGING, progress=90)
        if job.media_type == "video":
            output_path = os.path.join(work_dir, f"output_{job_id}.mp4")
            media_processor.merge_audio_video(media_path, tts_audio_path, output_path)
        else:
            output_path = tts_audio_path

        # Done
        update_job(
            db, job_id,
            status=JobStatus.COMPLETED,
            progress=100,
            output_file_path=output_path,
        )

    except Exception as e:
        error_msg = traceback.format_exc()
        update_job(db, job_id, status=JobStatus.FAILED, error_log=str(error_msg))
    finally:
        db.close()
