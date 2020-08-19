# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

import logging
from flask_restful import request
from cxcomm.rest.resource import BaseResource
from webargs import fields
from marshmallow import validate
from cxpasta import constants
from cxcomm.rest.response import JsonRes
from cxpasta.utils.job_utils import check_async_task_status
from cxpasta.utils import core


LOG = logging.getLogger(__name__)


class AsyncJob(BaseResource):

    def __init__(self):
        super().__init__()

        self.get_params_check = {
            "task_id": fields.Str(missing=None),
            "type": fields.Str(
                load_from='type',
                validate=validate.OneOf(list(constants.TASK_TYPE_DICT.keys()))
            )
        }

    def get(self):
        try:
            args = self.parser.parse(self.get_params_check, request)
            async_func = getattr(core, constants.TASK_TYPE_DICT[args['type']])
            data = check_async_task_status(async_func, args['task_id'])
            return JsonRes(data=data, info=[], code=200)
        except Exception as e:
            LOG.error("Params parser failed!")
            try:
                usr_err_mes = '\n'.join([i for item in e.messages.values() for i in item])
            except Exception as f:
                LOG.error(str(f))
                usr_err_mes = constants.DEFAULT_USER_ERR_MES
            return JsonRes(info=e, data={}, usr_err_mes=usr_err_mes, status=False, code=400)
