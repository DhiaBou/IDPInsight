from fastapi import Depends

from database.models.models import FirstModel
from routers.first_router.first_router_repo import FirstRouterRepo


class FirstRouterService:
    def __init__(self, repo: FirstRouterRepo = Depends(FirstRouterRepo)) -> None:
        self.repo = repo

    def get_data(self, id: int) -> FirstModel:
        return self.repo.get_model(id)
