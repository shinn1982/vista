# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.pool import StaticPool

from cxcomm.db.model import BASE


class DataBase(object):
    """
    get DB session
    """

    def __init__(self, db_url, autocommit=False):
        if 'sqlite' not in db_url:
            self.engine = create_engine(db_url, pool_recycle=3600)
        else:
            self.engine = create_engine(
                db_url, connect_args={'check_same_thread': False},
                poolclass=StaticPool,
                pool_recycle=3600,
                pool_size=20
            )
        if self.engine.name == 'sqlite':
            self.engine.execute("PRAGMA foreign_keys=ON")
        # self.session = sessionmaker(self.engine)(autocommit=autocommit)
        self.session = scoped_session(sessionmaker(bind=self.engine, autocommit=autocommit))

    def create_all(self):
        """
        create all tables
        """
        BASE.metadata.create_all(self.engine)

    def drop_all(self):
        """
        drop all tables
        """
        BASE.metadata.drop_all(self.engine)
