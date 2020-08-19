# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

import logging
from functools import wraps

from flask import request

LOG = logging.getLogger(__name__)


def log_request(f):
    """log flask request
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        LOG.info('API request url %s', request.url)
        if request.query_string:
            LOG.info('API query string %s', request.query_string)
        LOG.info('API request method %s', request.method)
        if request.method == 'POST':
            LOG.info('API POST data %s', request.json)
        if request.method == 'PUT':
            LOG.info('API PUT data %s', request.json)
        LOG.debug('API request environ %s', request.environ)
        return f(*args, **kwargs)
    return decorated_function
