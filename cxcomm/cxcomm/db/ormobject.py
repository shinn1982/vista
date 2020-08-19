# All rights reserved.

import logging

from sqlalchemy.exc import OperationalError
from cxcomm.exception import ObjectFieldInvalid, SqlExecuteError, ObjectFieldUpdateError
from cxcomm.db.fields import Field
from cxcomm import utils

LOG = logging.getLogger(__name__)


class ORMBaseObject(object):
    """the base  object
    """
    fields = {}
    db_model = None
    allow_update_key = []

    def __init__(self, **kwargs):
        for name, field in self.fields.items():
            if not isinstance(field, Field):
                raise ObjectFieldInvalid(
                    field=name, objname=self.obj_name())
            self.__dict__[name] = field.constraint(
                obj=self.obj_name(),
                attr=name,
                value=kwargs.get(name))

    @classmethod
    def obj_name(cls):
        """Return the object's name
        Return a canonical name for this object which will be used over
        the wire for remote hydration.
        """
        return cls.__name__

    @classmethod
    def sql_read(cls, sql, connection):
        """sql for read action like select
        """
        LOG.debug(sql)
        try:
            result = connection.engine.execute(sql)
            header = result.keys()
            for row in result:
                yield dict(zip(header, row))
        except OperationalError as e:
            LOG.info("recreate pool duo to %s" % e)
            connection.engine.pool.recreate()
            result = connection.engine.execute(sql)
            header = result.keys()
            for row in result:
                yield dict(zip(header, row))
        except Exception as ee:
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def sql_write(cls, sql, connection):
        """sql for write action like insert/update
        """
        LOG.debug(sql)
        try:
            connection.engine.execute(sql)
        except OperationalError as e:
            LOG.info("recreate pool duo to %s" % e)
            connection.engine.pool.recreate()
            connection.engine.execute(sql)
        except Exception as ee:
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def basic_select(cls, connection, columns="*", **kwargs):
        """
        :param connection: an instance of cxcomm.db.database.Database or its subclass
        :param columns: expected columns name string, seperated by comma
        :param kwargs: filter conditions
        :return: search result, a dictionary list
        """
        try:
            connection.session.commit()
            if columns == '*':
                for obj in connection.session.query(cls.db_model).filter_by(**kwargs):
                    yield obj
            else:
                header = [col.lstrip() for col in columns.split(',')]
                query_args = [getattr(cls.db_model, hea) for hea in header]
                query_obj = connection.session.query(*query_args).filter_by(**kwargs)
                for res in query_obj:
                    yield dict(zip(header, res))
        except OperationalError as e:
            LOG.info("recreate pool duo to %s" % e)
            connection.session.rollback()
            connection.engine.pool.recreate()
            connection.session.commit()
            if columns == '*':
                for obj in connection.session.query(cls.db_model).filter_by(**kwargs):
                    yield obj
            else:
                header = [col.lstrip() for col in columns.split(',')]
                query_args = [getattr(cls.db_model, hea) for hea in header]
                query_obj = connection.session.query(*query_args).filter_by(**kwargs)
                for res in query_obj:
                    yield dict(zip(header, res))
        except Exception as ee:
            connection.session.rollback()
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def order_pager_select(cls, connection, columns="*", curr_page_num=1, num_per_page=5, **kwargs):
        pass

    @classmethod
    def basic_count(cls, connection, columns="*", **kwargs):
        """
        :param connection: an instance of cxcomm.db.database.Database or its subclass
        :param columns: expected columns name string, seperated by comma
        :param kwargs: filter condition
        :return: amount
        """
        try:
            connection.session.commit()
            if columns == '*':
                return connection.session.query(cls.db_model).filter_by(**kwargs).count()
            else:
                query_args = [getattr(cls.db_model, col) for col in columns.split(',')]
                return connection.session.query(*query_args).filter_by(**kwargs).count()
        except OperationalError as e:
            LOG.info("recreate pool duo to %s" % e)
            connection.session.rollback()
            connection.engine.pool.recreate()
            connection.session.commit()
            if columns == '*':
                return connection.session.query(cls.db_model).filter_by(**kwargs).count()
            else:
                query_args = [getattr(cls.db_model, col) for col in columns.split(',')]
                return connection.session.query(*query_args).filter_by(**kwargs).count()
        except Exception as ee:
            connection.session.rollback()
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def insert_one(cls, connection, **kwargs):
        """
        :param connection: an instance of cxcomm.db.database.Database or its subclass
        :param kwargs: column value
        :return:
        """
        try:
            db_obj = cls.db_model(**kwargs)
            connection.session.add(db_obj)
            connection.session.commit()
            return db_obj
        except OperationalError as e:
            LOG.info("recreate pool duo to %s" % e)
            connection.session.rollback()
            connection.engine.pool.recreate()
            db_obj = cls.db_model(**kwargs)
            connection.session.add(db_obj)
            connection.session.commit()
            return db_obj
        except Exception as ee:
            connection.session.rollback()
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def insert_all(cls, connection, *args):
        """
        :param connection: multiple instances of cxcomm.db.database.Database or its subclass
        :param kwargs: column value
        :return:
        """
        try:
            db_objs = [cls.db_model(**arg) for arg in args]
            connection.session.add_all(db_objs)
            connection.session.commit()
            return db_objs
        except OperationalError as e:
            LOG.info("recreate pool duo to %s" % e)
            connection.session.rollback()
            connection.engine.pool.recreate()
            db_objs = [cls.db_model(**arg) for arg in args]
            connection.session.add_all(db_objs)
            connection.session.commit()
            return db_objs
        except Exception as ee:
            connection.session.rollback()
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def basic_update(cls, values, connection, **kwargs):
        """
        :param values: new values
        :param connection: an instance of cxcomm.db.database.Database or its subclass
        :param kwargs:  filter condition
        :return:
        """
        for vau in values:
            if vau not in cls.allow_update_key:
                raise ObjectFieldUpdateError(field=vau, objname=cls.obj_name())
        try:
            objs = connection.session.query(cls.db_model).filter_by(**kwargs)
            objs.update(values)
            connection.session.commit()
            return objs
        except OperationalError as e:
            LOG.info("recreate pool duo to %s" % e)
            connection.session.rollback()
            connection.engine.pool.recreate()
            objs = connection.session.query(cls.db_model).filter_by(**kwargs)
            objs.update(values)
            connection.session.commit()
            return objs
        except Exception as ee:
            connection.session.rollback()
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def basic_delete(cls, connection, **kwargs):
        """
        :param connection:  an instance of cxcomm.db.database.Database or its subclass
        :param kwargs: filter condition
        :return:
        """
        try:
            results = connection.session.query(cls.db_model).filter_by(**kwargs)
            for res in results:
                connection.session.delete(res)
            connection.session.commit()
        except OperationalError as e:
            LOG.info("recreate pool duo to %s" % e)
            connection.session.rollback()
            connection.engine.pool.recreate()
            results = connection.session.query(cls.db_model).filter_by(**kwargs)
            for res in results:
                connection.session.delete(res)
            connection.session.commit()
        except Exception as ee:
            connection.session.rollback()
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def trans_basic_count(cls, session, columns="*", **kwargs):
        try:
            if columns == '*':
                return session.query(cls.db_model).filter_by(**kwargs).count()
            else:
                query_args = [getattr(cls.db_model, col) for col in columns.split(',')]
                return session.query(*query_args).filter_by(**kwargs).count()
        except Exception as ee:
            session.rollback()
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def trans_basic_select(cls, session, columns="*", **kwargs):
        try:
            if columns == '*':
                for obj in session.query(cls.db_model).filter_by(**kwargs):
                    yield obj
            else:
                header = [col.lstrip() for col in columns.split(',')]
                query_args = [getattr(cls.db_model, hea) for hea in header]
                query_obj = session.query(*query_args).filter_by(**kwargs)
                for res in query_obj:
                    yield dict(zip(header, res))
        except Exception as ee:
            session.rollback()
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def trans_insert_one(cls, session, **kwargs):
        try:
            kwargs["id"] = utils.uuid_generator()
            db_obj = cls.db_model(**kwargs)
            session.add(db_obj)
            # connection.session.commit()
            return db_obj
        except Exception as ee:
            session.rollback()
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def trans_insert_all(cls, session, *args):
        try:
            db_objs = []
            for arg in args:
                arg["id"] = utils.uuid_generator()
                db_obj = cls.db_model(**arg)
                db_objs.append(db_obj)
            # db_objs = [cls.db_model(**arg) for arg in args]
            session.add_all(db_objs)
            # connection.session.commit()
            return db_objs
        except Exception as ee:
            session.rollback()
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def trans_basic_update(cls, session, values, **kwargs):
        for vau in values:
            if vau not in cls.allow_update_key:
                raise ObjectFieldUpdateError(field=vau, objname=cls.obj_name())
        try:
            objs = session.query(cls.db_model).filter_by(**kwargs)
            objs.update(values)
            return objs
        except Exception as ee:
            session.rollback()
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))

    @classmethod
    def trans_basic_delete(cls, session, **kwargs):
        try:
            results = session.query(cls.db_model).filter_by(**kwargs)
            for res in results:
                session.delete(res)
            # connection.session.commit()
        except Exception as ee:
            session.rollback()
            LOG.error(ee)
            raise SqlExecuteError(info=str(ee))
