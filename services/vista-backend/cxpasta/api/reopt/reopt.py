# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

import logging
from flask import request
from cxcomm.rest.resource import BaseResource
from cxcomm.rest.response import JsonRes
from cxpasta.utils.parser_reopt import pasta_reopt
from cxpasta.utils.core import reopt_global, reopt_congest_dispatch, nonbod_reopt_global

LOG = logging.getLogger(__name__)


class NonbodReoptimize(BaseResource):

    def __init__(self):
        super().__init__()

    def post(self):
        try:
            args = self.parser.parse(pasta_reopt, request)
            result = nonbod_reopt_global(args)
            LOG.debug(result)

            if result.get("info"):
                LOG.debug(result.get("info"))
                LOG.debug(type(result.get("info")))
                return JsonRes(info=result.get("info"), usr_err_mes="Pasta Reoptimize Exception!",
                               status=False, data=[], code=400)
            else:
                return JsonRes(data=result.get("data"), info=result.get("info"), code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="Pasta Reoptimize Exception!", status=False, data=[], code=400)


class BodReoptimize(BaseResource):

    def __init__(self):
        super().__init__()

    def post(self):
        try:
            args = self.parser.parse(pasta_reopt, request)
            if "congested_link" in args.keys():
                result = reopt_congest_dispatch(args)
            else:
                result = reopt_global(args)
            LOG.debug(result)

            if result.get("info"):
                LOG.debug(result.get("info"))
                LOG.debug(type(result.get("info")))
                return JsonRes(info=result.get("info"), usr_err_mes="Reoptimize Exception!",
                               status=False, data=[], code=400)
            else:
                return JsonRes(data=result.get("data"), info=result.get("info"), code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="Reoptimize Exception!", status=False, data=[], code=400)


class AsyncNonbodReoptimize(BaseResource):

    def __init__(self):
        super().__init__()

    def post(self):
        try:
            args = self.parser.parse(pasta_reopt, request)
            async_task = nonbod_reopt_global.delay(args)
            LOG.debug('aysnc task_id: ' + async_task.id)
            return JsonRes(data={'task_id': async_task.id}, info=[], code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="Pasta Reoptimize Exception!", status=False, data=[], code=400)


class AsyncBodReoptimize(BaseResource):

    def __init__(self):
        super().__init__()

    def post(self):
        try:
            args = self.parser.parse(pasta_reopt, request)
            if "congested_link" in args.keys():
                async_task = reopt_congest_dispatch.delay(args)
            else:
                async_task = reopt_global.delay(args)
            LOG.debug('aysnc task_id: ' + async_task.id)
            return JsonRes(data={'task_id': async_task.id}, info=[], code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="Reoptimize Exception!", status=False, data=[], code=400)
