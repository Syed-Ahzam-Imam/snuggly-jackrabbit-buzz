from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Dict, Any, Optional

class ResponseCreate(BaseModel):
    lead_id: str
    answers: Dict[str, Any]

class ResponseInDB(ResponseCreate):
    id: str = Field(alias="_id")
    result_analysis: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True)

class AnalysisResponse(BaseModel):
    result_id: str
    analysis: Dict[str, Any]