from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional

class LeadBase(BaseModel):
    name: str
    email: EmailStr
    company_size: str

class LeadCreate(LeadBase):
    pass

class LeadInDB(LeadBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True)

class LeadResponse(BaseModel):
    id: str