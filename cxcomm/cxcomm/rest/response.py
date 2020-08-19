# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

import datetime
import json

from flask import Response

_SIMPLE_TYPE = (str, int, type(None), bool, float)


def json_encoder(value):
    """Handy for JSON serialization
    """
    if isinstance(value, _SIMPLE_TYPE):
        return value
    if isinstance(value, datetime.datetime):
        return value.isoformat() + "Z"
    elif isinstance(value, Exception):
        return {
            "exception": value.__class__.__name__,
            "message": str(value),
        }
    return str(value)


class JsonRes(Response):
    '''
    json response
    status code:
    200: OK
    201: created
    400: bad request
    403: forbidden
    404: not found
    '''

    def __init__(self, data=None, info=None, usr_err_mes=None, err_code=0, status=True, code=None):
        self.res = {
            "status": status,
            "info": info,
            "data": data
        }
        content = json.dumps(self.res, default=json_encoder)
        if not status:
            content = json.loads(content)
            content['info']['err_code'] = err_code
            if usr_err_mes is not None:
                content['info']['usr_err_mess'] = usr_err_mes
            content = json.dumps(content)
        try:
            super().__init__(content, status=code, mimetype="application/json")
        except TypeError:
            super(JsonRes, self).__init__(content, status=code, mimetype="application/json")
