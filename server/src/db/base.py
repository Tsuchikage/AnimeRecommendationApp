import re

from sqlalchemy import BigInteger, Column, MetaData
from sqlalchemy.orm import as_declarative, declared_attr

convention = {
    "all_column_names": lambda constraint, table: "_".join(
        [column.name for column in constraint.columns.values()]
    ),
    "ix": "ix__%(table_name)s__%(all_column_names)s",
    "uq": "uq__%(table_name)s__%(all_column_names)s",
    "ck": "ck__%(table_name)s__%(constraint_name)s",
    "fk": ("fk__%(table_name)s__%(all_column_names)s__" "%(referred_table_name)s"),
    "pk": "pk__%(table_name)s",
}

metadata = MetaData(naming_convention=convention)


@as_declarative()
class Base:
    metadata = metadata
    __name__: str

    id = Column(BigInteger, primary_key=True, index=True)

    @declared_attr
    def __tablename__(cls) -> str:
        name_list = re.findall(r"[A-Z][a-z\d]*", cls.__name__)
        return "_".join(name_list).lower()