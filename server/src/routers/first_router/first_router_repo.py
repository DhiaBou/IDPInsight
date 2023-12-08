from fastapi import Depends
from sqlalchemy.orm import Session

from database.database import database_session
from database.models.models import FirstModel


class FirstRouterRepo:
    def __init__(self, session: Session = Depends(database_session)) -> None:
        self.session = session

    def get_model(self, id: int) -> FirstModel:
        res = self.session.query(FirstModel).filter(FirstModel.id == id).one_or_none()
        return res
