from sqlalchemy import  Column, String

from db.base import Base
from db.mixins import TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    username = Column(String(length=255), unique=True, index=True, nullable=False)
    password = Column(String(length=255), nullable=False)

