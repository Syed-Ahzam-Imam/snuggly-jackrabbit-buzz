from fastapi import APIRouter, HTTPException, status, File, UploadFile, BackgroundTasks
from app.models.response import ResponseCreate, AnalysisResponse
from app.db.database import db
from datetime import datetime
from bson import ObjectId
from app.services.ai_service import generate_analysis
from app.services.email_service import send_report_email

router = APIRouter()

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

    # Generate AI Analysis
    analysis = await generate_analysis(response.answers)

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

@router.post("/results/{result_id}/email", status_code=status.HTTP_200_OK)
async def email_result(
    result_id: str,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    if not ObjectId.is_valid(result_id):
        raise HTTPException(status_code=400, detail="Invalid result_id format")

    response = await db.responses.find_one({"_id": ObjectId(result_id)})
    if not response:
        raise HTTPException(status_code=404, detail="Result not found")

    lead_id = response.get("lead_id")
    if not lead_id:
        raise HTTPException(status_code=404, detail="Lead not found for this result")

    lead = await db.leads.find_one({"_id": ObjectId(lead_id)})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    email = lead.get("email")
    name = lead.get("name")
    if not email:
         raise HTTPException(status_code=400, detail="Lead has no email address")

    # Read the file content
    pdf_content = await file.read()
    
    # Send email in background
    background_tasks.add_task(send_report_email, email, pdf_content, filename = f"founder-clarity-report-{name}.pdf")
    
    return {"message": "Email queued successfully"}