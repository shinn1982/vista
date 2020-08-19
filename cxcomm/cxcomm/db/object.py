# All rights reserved.

import time
import logging
import copy

from cxcomm.exception import ObjectFieldInvalid, ObjectFieldUpdateError
from cxcomm.utils import uuid_generator
from cxcomm.db.fields import Field
import cxcomm.db.api as db_api

LOG = logging.getLogger(__name__)


class BaseObject(object):
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
        return db_api.execute_sql_read(sql, connection=connection)

    @classmethod
    def sql_write(cls, sql, connection):
        """sql for write action like insert/update
        """
        LOG.debug(sql)
        return db_api.excute_sql_write(sql, connection=connection)

    @classmethod
    def basic_select(cls, connection, columns="*", **kwargs):
        """sql select
        - columns: are columns to return, default is * (all columns)
        - kwargs: are filters and here only support `equal` and `and`

        for example, if we call the method like

        select(connection, columns='a, b', a=1, b=2, c=2)

        it will execute sql SELECT a, b from tablename where a=1 and b=2 and c=2
        and the return value is a generator
        """
        func = lambda v: v.replace('\'', '\'\'') if isinstance(v, str) else v
        if kwargs:
            where = ' AND '. join(
                ["%s='%s'" % (k, func(v)) for k, v in kwargs.items()])
            sql = f'SELECT {columns} FROM {cls.db_model.__tablename__} where {where}'
        else:
            sql = f'SELECT {columns} FROM {cls.db_model.__tablename__}'
        sql = sql.replace("='None'", ' is NULL')
        LOG.debug(sql)
        return db_api.execute_sql_read(sql, connection=connection)

    @classmethod
    def basic_count(cls, connection, columns="*", **kwargs):
        """
        Count the number of objects matching filtering criteria.
        """
        func = lambda v: v.replace('\'', '\'\'') if isinstance(v, str) else v
        if kwargs:
            where = ' AND '. join(["%s='%s'" % (k, func(v)) for k, v in kwargs.items()])
            sql = f'SELECT COUNT({columns}) AS count FROM {cls.db_model.__tablename__} WHERE {where}'
        else:
            sql = f'SELECT COUNT({columns}) AS count FROM {cls.db_model.__tablename__}'
        sql = sql.replace("='None'", ' is NULL')
        LOG.debug(sql)
        return next(db_api.execute_sql_read(sql=sql, connection=connection)).get('count')

    @classmethod
    def basic_delete(cls, connection, **kwargs):
        """delete objects"""
        delete_str = "DELETE FROM %s " % cls.db_model.__tablename__

        where_str = "WHERE "
        for arg in kwargs:
            if isinstance(kwargs[arg], str):
                where_str += "%s='%s'" % (arg, kwargs[arg].replace('\'', '\'\'')) + " AND "
            elif isinstance(kwargs[arg], int) or isinstance(kwargs[arg], float):
                where_str += "%s=%s" % (arg, kwargs[arg]) + " AND "
        where_str = where_str[:len(where_str) - 5]
        sql = delete_str + where_str
        LOG.debug(sql)
        db_api.excute_sql_write(sql, connection=connection)

    @classmethod
    def insert_one(cls, connection=None, **kwargs):
        """insert one
        """
        if hasattr(cls.db_model, 'created_on'):
            kwargs['created_on'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
            kwargs['updated_on'] = kwargs['created_on']
        if not kwargs.get('id'):
            kwargs['id'] = uuid_generator()
        tmp_kwargs = copy.deepcopy(kwargs)
        for arg in tmp_kwargs:
            if kwargs[arg] is None:
                kwargs.pop(arg)
        keys = kwargs.keys()
        value_list = []
        for key in keys:
            value_list.append(kwargs[key])
        table_name = "INSERT INTO %s"
        columns = "(" + "%s, " * (len(kwargs) - 1) + "%s" + ")"
        values = "VALUES ("
        length = len(value_list)
        num = 1
        for value in value_list:
            if isinstance(value, str):
                value = value.replace('\\', '\\\\').replace('\'', '\'\'')
                if num < length:
                    values += "'%s', " % value
                else:
                    values += "'%s'" % value
                num += 1
            elif isinstance(value, int) or isinstance(value, float):
                if num < length:
                    values += "%s, " % value
                else:
                    values += "%s" % value
                num += 1
        values += ")"
        sql = table_name % cls.db_model.__tablename__ + " " + columns % tuple(keys) + " " + values
        LOG.debug(sql)
        db_api.excute_sql_write(sql, connection=connection)
        return kwargs

    @classmethod
    def basic_update(cls, values, connection, **kwargs):
        """update objects"""
        objs = cls.basic_select(connection, **kwargs)
        update_str = "UPDATE %s " % cls.db_model.__tablename__

        where_str = " WHERE "
        for arg in kwargs:
            if isinstance(kwargs[arg], str):
                where_str += "%s='%s'" % (arg, kwargs[arg].replace('\'', '\'\'')) + " AND "
            elif isinstance(kwargs[arg], int) or isinstance(kwargs[arg], float):
                where_str += "%s=%s" % (arg, kwargs[arg]) + " AND "
        where_str = where_str[:len(where_str) - 5]

        set_str = "SET "
        for vau in values:
            if vau not in cls.allow_update_key:
                raise ObjectFieldUpdateError(
                    field=vau, objname=cls.obj_name()
                )
            if isinstance(values[vau], str):
                set_str += "%s='%s'" % (vau, values[vau].replace('\\', '\\\\').replace('\'', '\'\'')) + ", "
            elif isinstance(values[vau], int) or isinstance(values[vau], float):
                set_str += "%s=%s" % (vau, values[vau]) + ", "
            elif values[vau] is None:
                set_str += "%s=%s" % (vau, 'null') + ", "
        set_str = set_str[:len(set_str) - 2]

        sql = update_str + set_str + where_str
        LOG.debug(sql)
        db_api.excute_sql_write(sql, connection=connection)

        get_result_sql = 'select * from %s where id in %s' \
                         % (cls.db_model.__tablename__, str(tuple(obj.get('id') for obj in objs))[:-2] + ')')
        return db_api.execute_sql_read(get_result_sql, connection=connection)
