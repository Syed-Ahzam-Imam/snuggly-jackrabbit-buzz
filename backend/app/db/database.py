from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

async def check_db_connection():
    try:
        await client.admin.command('ismaster')
        return True, None
    except Exception as e:
        return False, str(e)  # or repr(e) if you want full detail
