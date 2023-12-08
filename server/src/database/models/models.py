from sqlalchemy import Boolean

from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class FirstModel(Base):
    __tablename__ = "first_model"
    id = Column(Integer, primary_key=True)
