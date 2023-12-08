from pydantic import BaseModel, ConfigDict


class FirstDTO(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    data: str
