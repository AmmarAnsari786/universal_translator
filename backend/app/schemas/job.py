from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime


class JobCreate(BaseModel):
    url: str
    target_language: str
    source_language: str = "auto"
    media_type: str = "video"


class JobResponse(BaseModel):
    id: str
    source_url: str
    media_type: str
    source_language: str
    target_language: str
    status: str
    progress: int
    output_file_path: Optional[str] = None
    error_log: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
