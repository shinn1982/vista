# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

import pymysql.cursors
import sqlalchemy.engine.url as url


def mysql_global_connection(my_url):
    my_cnf = url.make_url(my_url)
    connection = pymysql.connect(
        host=my_cnf.host,
        port=my_cnf.port,
        user=my_cnf.username,
        password=my_cnf.password,
        db=my_cnf.database,
        charset="utf8"
    )
    return connection


def execute_sql_read(sql, connection):
    """execute sql in mysql shell
    """
    with connection.cursor() as cursor:
        cursor.execute(sql)
        header = [item[0] for item in cursor.description]
        for row in cursor:
            yield dict(zip(header, row))


def excute_sql_write(sql, connection):
    """update and commit
    """
    with connection.cursor() as cursor:
        if isinstance(sql, list):
            for s in sql:
                cursor.execute(s)
        else:
            cursor.execute(sql)
    connection.commit()
