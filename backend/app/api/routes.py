import os
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.models.database import get_db, TranslationJob, JobStatus
from app.schemas.job import JobCreate, JobResponse
from app.worker import run_translation_pipeline
from app.config import SUPPORTED_LANGUAGES

router = APIRouter(prefix="/api/v1", tags=["jobs"])


@router.post("/jobs", response_model=JobResponse)
def create_job(payload: JobCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if payload.target_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail="Unsupported target language")

    job = TranslationJob(
        source_url=payload.url,
        target_language=payload.target_language,
        source_language=payload.source_language,
        media_type=payload.media_type,
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    background_tasks.add_task(run_translation_pipeline, job.id)

    return job


@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(TranslationJob).filter(TranslationJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/jobs", response_model=list[JobResponse])
def list_jobs(db: Session = Depends(get_db)):
    return db.query(TranslationJob).order_by(TranslationJob.created_at.desc()).limit(50).all()


@router.get("/download/{job_id}")
def download_output(job_id: str, db: Session = Depends(get_db)):
    job = db.query(TranslationJob).filter(TranslationJob.id == job_id).first()
    if not job or job.status != JobStatus.COMPLETED:
        raise HTTPException(status_code=404, detail="Output not available")
    if not os.path.exists(job.output_file_path):
        raise HTTPException(status_code=404, detail="Output file missing")
    return FileResponse(job.output_file_path, filename=os.path.basename(job.output_file_path))


@router.get("/languages")
def get_languages():
    return [{"code": k, "name": v} for k, v in SUPPORTED_LANGUAGES.items()]
