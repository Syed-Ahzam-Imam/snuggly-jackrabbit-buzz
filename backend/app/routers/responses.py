from fastapi import APIRouter, HTTPException, status
from app.models.response import ResponseCreate, AnalysisResponse
from app.db.database import db
from datetime import datetime
from bson import ObjectId
import random

router = APIRouter()

# Dummy analysis data for MVP
MINDSET_SHIFTS = [
    {
        "title": "From 'Doing It All' to 'Delegating with Trust'",
        "description": "You often feel like the bottleneck. The key shift is building systems that allow your team to execute without your constant oversight."
    },
    {
        "title": "From 'Reactive Firefighting' to 'Strategic Planning'",
        "description": "You spend too much time solving immediate problems. The shift is to carve out protected time for high-level strategy and vision."
    },
    {
        "title": "From 'Product-Focus' to 'Market-Dominance'",
        "description": "Your product is great, but distribution is lagging. The shift is to obsess over channels and customer acquisition cost as much as features."
    }
]

@router.post("/responses", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def submit_response(response: ResponseCreate):
    # Verify lead exists
    try:
        if not ObjectId.is_valid(response.lead_id):
             raise HTTPException(status_code=400, detail="Invalid lead_id format")
             
        lead = await db.leads.find_one({"_id": ObjectId(response.lead_id)})
        if not lead:
             raise HTTPException(status_code=404, detail="Lead not found")
    except Exception as e:
         # Handle other potential errors during DB lookup
         if isinstance(e, HTTPException):
             raise e
         raise HTTPException(status_code=500, detail=str(e))

    # Generate Dummy Analysis
    analysis = random.choice(MINDSET_SHIFTS)

    response_dict = response.model_dump()
    response_dict["result_analysis"] = analysis
    response_dict["created_at"] = datetime.utcnow()

    new_response = await db.responses.insert_one(response_dict)
    
    return {
        "result_id": str(new_response.inserted_id),
        "analysis": analysis
    }

@router.get("/results/{result_id}", response_model=AnalysisResponse)
async def get_result(result_id: str):
    if not ObjectId.is_valid(result_id):
        raise HTTPException(status_code=400, detail="Invalid result_id format")
        
    response = await db.responses.find_one({"_id": ObjectId(result_id)})
    if not response:
        raise HTTPException(status_code=404, detail="Result not found")
    
    return {
        "result_id": str(response["_id"]),
        "analysis": response["result_analysis"]
    }