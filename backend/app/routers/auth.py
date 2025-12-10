from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.config import settings
from app.core.security import get_password_hash, verify_password, create_access_token
from app.db.database import db
from app.models.admin import AdminCreate, AdminLogin, AdminResponse, Token, AdminInDB, TokenData

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_admin(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    admin = await db.admins.find_one({"email": token_data.email})
    if admin is None:
        raise credentials_exception
    # Convert ObjectId to string for Pydantic compatibility if needed, 
    # though Pydantic v2 often handles str(ObjectId) automatically via coercion
    admin["_id"] = str(admin["_id"])
    return admin

@router.post("/signup", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
async def signup(admin_in: AdminCreate):
    # Check if admin already exists
    existing_admin = await db.admins.find_one({"email": admin_in.email})
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(admin_in.password)
    
    # Create admin document
    admin_data = AdminInDB(
        email=admin_in.email,
        hashed_password=hashed_password
    )
    
    result = await db.admins.insert_one(admin_data.model_dump(by_alias=True))
    
    # Fetch created admin
    new_admin = await db.admins.find_one({"_id": result.inserted_id})
    new_admin["_id"] = str(new_admin["_id"])
    return new_admin

@router.post("/login", response_model=Token)
async def login(admin_in: AdminLogin):
    admin = await db.admins.find_one({"email": admin_in.email})
    if not admin or not verify_password(admin_in.password, admin["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=admin["email"], expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=AdminResponse)
async def read_users_me(current_admin: Annotated[dict, Depends(get_current_admin)]):
    return current_admin