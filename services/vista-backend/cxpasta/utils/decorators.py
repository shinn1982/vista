import time
import json

from webargs import ValidationError
from cxcomm.rest.response import JsonRes


def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        data = func(*args, **kwargs)
        end = time.time()
        return ({
            **data,
            "time": round((end - start) * 1000, 2),
        })

    return wrapper


def res_format(func):
    def wrapper(*args, **kwargs):
        try:
            data = func(*args, **kwargs)
            return JsonRes(data=data, info={}, status=True, code=201)
        except ValidationError as err:
            info = {
                'exception': 'ValidationError',
                'message': json.dumps(err.messages)
            }
            return JsonRes(data={}, info=info, status=False, usr_err_mes='Invalid Input', err_code=0, code=400)
        except Exception as err:
            return JsonRes(data={}, info=err, status=False, usr_err_mes='Pasta Error', err_code=0, code=400)

    return wrapper
