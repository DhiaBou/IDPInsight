from fastapi import APIRouter

wahlkreis_router = APIRouter(
    prefix="/wahlkreis",
)

@wahlkreis_router.get("/")
async def get_wahlkreis():
    return []