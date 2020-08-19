# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

import logging

from flask_restful import reqparse
from flask_restful import Resource
from webargs import flaskparser, ValidationError

from cxcomm.decorator import log_request

LOG = logging.getLogger(__name__)


class BaseResource(Resource):
    """Resource base class
    """
    method_decorators = [log_request]

    def __init__(self):
        self.parser = flaskparser.FlaskParser()
        self.parser.error_handler(self.handle_error)
        self.request = reqparse.RequestParser()
        super().__init__()

    def handle_error(self, err, req, schema):
        raise ValidationError(err.messages)
