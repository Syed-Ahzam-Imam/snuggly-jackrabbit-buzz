from typing import Annotated, List, Dict, Any
from fastapi import APIRouter, Depends
from app.routers.auth import get_current_admin
from app.db.database import db
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/admin", tags=["admin"])

class StatsResponse(BaseModel):
    total_leads: int
    total_responses: int
    completion_rate: float

class AdminResponseItem(BaseModel):
    id: str
    name: str
    email: str
    answers: Dict[str, Any]
    created_at: datetime

@router.get("/stats", response_model=StatsResponse)
async def get_stats(current_admin: Annotated[dict, Depends(get_current_admin)]):
    total_leads = await db.leads.count_documents({})
    total_responses = await db.responses.count_documents({})
    
    completion_rate = 0.0
    if total_leads > 0:
        completion_rate = (total_responses / total_leads) * 100
        
    return {
        "total_leads": total_leads,
        "total_responses": total_responses,
        "completion_rate": round(completion_rate, 2)
    }

@router.get("/responses", response_model=List[AdminResponseItem])
async def get_responses(current_admin: Annotated[dict, Depends(get_current_admin)]):
    # Fetch latest 50 responses
    cursor = db.responses.find().sort("created_at", -1).limit(50)
    responses_list = await cursor.to_list(length=50)
    
    result = []
    for resp in responses_list:
        lead_id = resp.get("lead_id")
        lead = None
        if lead_id:
            try:
                lead = await db.leads.find_one({"_id": ObjectId(lead_id)})
            except:
                pass 
        
        result.append({
            "id": str(resp["_id"]),
            "name": lead["name"] if lead else "Unknown",
            "email": lead["email"] if lead else "Unknown",
            "answers": resp.get("answers", {}),
            "created_at": resp.get("created_at")
        })
        
    return result