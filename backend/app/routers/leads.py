from fastapi import APIRouter, HTTPException, status
from app.models.lead import LeadCreate, LeadResponse
from app.db.database import db
from datetime import datetime

router = APIRouter()

@router.post("/leads", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(lead: LeadCreate):
    lead_dict = lead.model_dump()
    lead_dict["created_at"] = datetime.utcnow()
    
    new_lead = await db.leads.insert_one(lead_dict)
    
    return {"id": str(new_lead.inserted_id)}