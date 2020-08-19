# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

import logging
from flask_restful import request
from cxcomm.rest.resource import BaseResource
from cxcomm.rest.response import JsonRes

from cxpasta.utils.parser import pasta, simple, path
from cxpasta.utils.parser_policy import pasta_policy
from cxpasta.utils.pasta import Pasta, Simple, Path
from cxpasta.utils.decorators import res_format
from cxpasta.utils.core import path_calculation_v2, path_modified, nonbod_path_calculation

LOG = logging.getLogger(__name__)


class PastaResource(BaseResource):

    def __init__(self):
        super().__init__()

    @res_format
    def post(self):
        args = self.parser.parse(pasta, request)
        data = Pasta(**args).run()
        return data


class SimpleResource(BaseResource):

    def __init__(self):
        super().__init__()

    @res_format
    def post(self):
        args = self.parser.parse(simple, request)
        data = Simple(**args).run()
        return data


class PathResource(BaseResource):

    def __init__(self):
        super().__init__()

    @res_format
    def post(self):
        args = self.parser.parse(path, request)
        data = Path(**args).run()
        return data


class NonBodPASTA(BaseResource):

    def __init__(self):
        super().__init__()

    def post(self):
        try:
            args = self.parser.parse(pasta_policy, request)
            nodes = args['nodes']
            links = args['links']
            sr_policy = args['sr_policy']
            global_params = args['global']

            result = nonbod_path_calculation(nodes, links, sr_policy, global_params)
            LOG.debug(result)
            if result.get("info"):
                return JsonRes(info=result.get("info"), usr_err_mes="Create Exception!", status=False, data=[],
                               code=400)
            else:
                return JsonRes(data=result.get("data"), info=result.get("info"), code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="Create Exception", status=False, data=[], code=400)


class BodSRPolicy(BaseResource):

    def __init__(self):
        super().__init__()

    def post(self):
        try:
            args = self.parser.parse(pasta_policy, request)
            nodes = args['nodes']
            links = args['links']
            sr_policy = args['sr_policy']
            global_params = args['global']

            result = path_calculation_v2(nodes, links, sr_policy, global_params)
            LOG.debug(result)
            if result.get("info"):
                return JsonRes(info=result.get("info"), usr_err_mes="Create Exception!", status=False, data=[],
                               code=400)
            else:
                return JsonRes(data=result.get("data"), info=result.get("info"), code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="Create Exception", status=False, data=[], code=400)

    def put(self):
        try:
            args = self.parser.parse(pasta_policy, request)
            result = path_modified(args)
            LOG.debug(result)
            if result.get("info"):
                return JsonRes(info=result.get("info"), usr_err_mes="Modify Exception!",
                               status=False, data=[], code=400)
            else:
                return JsonRes(data=result.get("data"), info=result.get("info"), code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="Modify Exception", status=False, data=[], code=400)


class AsyncNonBodPASTA(BaseResource):

    def __init__(self):
        super().__init__()

    def post(self):
        try:
            args = self.parser.parse(pasta_policy, request)
            nodes = args['nodes']
            links = args['links']
            sr_policy = args['sr_policy']
            global_params = args['global']
            async_task = nonbod_path_calculation.delay(nodes, links, sr_policy, global_params)
            LOG.debug('aysnc task_id: ' + async_task.id)
            return JsonRes(data={'task_id': async_task.id}, info=[], code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="Create Exception", status=False, data=[], code=400)


class AsyncBodSRPolicy(BaseResource):

    def __init__(self):
        super().__init__()

    def post(self):
        try:
            args = self.parser.parse(pasta_policy, request)
            nodes = args['nodes']
            links = args['links']
            sr_policy = args['sr_policy']
            global_params = args['global']
            async_task = path_calculation_v2.delay(nodes, links, sr_policy, global_params)
            LOG.debug('aysnc task_id: ' + async_task.id)
            return JsonRes(data={'task_id': async_task.id}, info=[], code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="Create Exception", status=False, data=[], code=400)

    def put(self):
        try:
            args = self.parser.parse(pasta_policy, request)
            async_task = path_modified.delay(args)
            LOG.debug('aysnc task_id: ' + async_task.id)
            return JsonRes(data={'task_id': async_task.id}, info=[], code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="Modify Exception", status=False, data=[], code=400)
