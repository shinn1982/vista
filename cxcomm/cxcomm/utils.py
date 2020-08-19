# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

from datetime import datetime, timedelta
import random
import string
import uuid
import hashlib

import six
import prettytable

def timestamp():
    """return current time
    """
    return datetime.now().__str__()


def timedelta_for_human(seconds):
    """convert seconds to day,hour,min,second
    """
    sec = timedelta(seconds=int(seconds))
    try:
        d = datetime(1, 1, 1) + sec
    except OverflowError:
        return "0d0h0m0s"
    return "%dd%dh%dm%ds" % (d.day - 1, d.hour, d.minute, d.second)


def humantimestr_to_seconds(timestr):
    tmp = timestr.split('d')
    day = tmp[0]
    tmp = tmp[1].split('h')
    hour = tmp[0]
    tmp = tmp[1].split('m')
    _min = tmp[0]
    tmp = tmp[1].split('s')
    sec = tmp[0]
    deltatime = timedelta(days=int(day), hours=int(hour), minutes=int(_min), seconds=int(sec))
    seconds = deltatime.total_seconds()
    return seconds


def name_generator(length=10):
    """generate random name
    """
    return ''.join(random.sample(string.ascii_lowercase + string.digits, length))


def uuid_generator():
    """generate uuid string
    """
    return uuid.uuid4().hex


def hash_generator(node_str):
    """return hash value
    """
    return hashlib.sha224(node_str.encode('utf-8')).hexdigest()


def prefix_dict_str(value):
    """dict to string format
    """
    return ','.join(["%s:%s" % (k, value[k])for k in sorted(value.keys())])

def print_list(objs, fields, exclude_unavailable=False):
    """Prints a list of objects.
    @param objs: Objects to print
    @param fields: Fields on each object to be printed
    @param exclude_unavailable: Boolean to decide if unavailable fields are
                                removed
    """
    rows = []
    removed_fields = []
    for o in objs:
        row = []
        for field in fields:
            if field in removed_fields:
                continue
            if isinstance(o, dict) and field in o:
                data = o[field]
            else:
                if not hasattr(o, field) and exclude_unavailable:
                    removed_fields.append(field)
                    continue
                else:
                    data = getattr(o, field, '')
            if data is None:
                data = '-'
            if isinstance(data, six.string_types) and "\r" in data:
                data = data.replace("\r", " ")
            row.append(data)
        rows.append(row)

    for f in removed_fields:
        fields.remove(f)

    pt = prettytable.PrettyTable((f for f in fields), caching=False)
    pt.align = 'l'
    for row in rows:
        pt.add_row(row)
    print(pt)
