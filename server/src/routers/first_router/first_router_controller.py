from fastapi import APIRouter, Depends

from routers.first_router.first_router_dto import FirstDTO
from routers.first_router.first_router_service import FirstRouterService

first_router = APIRouter()


@first_router.get("/get-data/{id}", response_model=FirstDTO)
async def get_data(
    id: int,
    service: FirstRouterService = Depends(FirstRouterService),
) -> FirstDTO:
    model = service.get_data(id)
    return FirstDTO(
        id=model.id,
        data=str(model.id) + "data",
    )
