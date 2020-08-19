# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.


# check whether duplicated records existed
def check_duplicated(collection, **kwargs):

    if collection.find(kwargs).count() == 0:
        return False
    else:
        return True


# check whether record is existed
def has_record(collection, **kwargs):
    return check_duplicated(collection, **kwargs)
