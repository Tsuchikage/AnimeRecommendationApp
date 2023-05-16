import datetime

from sqlalchemy import Column, DateTime, func


class TimestampMixin:
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(
        DateTime,
        server_default=func.now(),
        server_onupdate=func.now(),
        onupdate=datetime.datetime.now,
    )