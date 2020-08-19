# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

from sqlalchemy import Column, String, func, TIMESTAMP, text
from sqlalchemy.ext.declarative import declarative_base

from cxcomm import utils

BASE = declarative_base()


class BaseTable(BASE):
    """
    base table
    """
    __abstract__ = True

    def to_dict(self):
        """Make the model object behave like a dict.
        """
        return {c.name: getattr(self, c.name, None) for c in self.__table__.columns}


class HasId(object):
    """add if subclass have an id
    """

    id = Column(String(36), primary_key=True, default=utils.uuid_generator)


class HasNameDescription(object):
    """add if subclass have name and description
    """
    name = Column(String(45), nullable=True)
    description = Column(String(100), nullable=True)


class HasTime(object):
    """has create and update time stamp columns.
    """
    # created_on = Column(TIMESTAMP, server_default=func.now())
    created_on = Column(TIMESTAMP, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_on = Column(TIMESTAMP, nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    # created_on = Column(TIMESTAMP, server_default=func.now())
    # updated_on = Column(TIMESTAMP, onupdate=func.now())
