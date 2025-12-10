from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional

class AdminBase(BaseModel):
    email: EmailStr

class AdminCreate(AdminBase):
    password: str = Field(..., min_length=8)

class AdminLogin(AdminBase):
    password: str

class AdminInDB(AdminBase):
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AdminResponse(AdminBase):
    id: str = Field(alias="_id")
    created_at: datetime

    model_config = ConfigDict(populate_by_name=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None