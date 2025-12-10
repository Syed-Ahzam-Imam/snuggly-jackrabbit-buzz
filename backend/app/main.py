from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import check_db_connection
from app.routers import auth, leads, responses, admin

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(responses.router)
app.include_router(admin.router)

@app.get("/healthz")
async def health_check():
    is_connected = await check_db_connection()
    if is_connected:
        return {"status": "ok", "db": "connected"}
    return {"status": "error", "db": "disconnected"}