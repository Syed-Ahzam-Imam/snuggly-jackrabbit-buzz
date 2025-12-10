from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

async def check_db_connection():
    try:
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        return True
    except Exception:
        return False