# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

import logging
from flask import request
from flask import current_app
from cxcomm.rest.resource import BaseResource
from cxcomm.rest.response import JsonRes
from webargs import fields, validate
from cxpasta.utils.mongo_utils import check_duplicated, has_record
from pymongo import InsertOne

LOG = logging.getLogger(__name__)


class Topology(BaseResource):

    def __init__(self):
        super().__init__()

        self.get_params_check = {
            "snapshot_name": fields.Str(load_from="snapshot_name", required=True)
        }

    def snapshot_validate(self, snapshot_name):

        filter_dict = {
            "snapshot_name": snapshot_name
        }
        return has_record(current_app.mongo.db.snapshot, **filter_dict)

    def post(self):
        try:
            request_body = request.get_json()
            snapshot_name = request_body['snapshot_name']

            if not self.snapshot_validate(snapshot_name):
                return JsonRes(info={},
                               usr_err_mes="No Snapshot named %s is found! Please import snapshot first!" %
                                           snapshot_name,
                               err_code=0,
                               status=False, data=[])

            filter_dict = {
                "snapshot_name": request_body['snapshot_name']
            }
            if check_duplicated(current_app.mongo.db.topo, **filter_dict):
                return JsonRes(info={}, usr_err_mes="Duplicated Snapshot name, please change another name!",
                               status=False, data=[], code=400)

            result = current_app.mongo.db.topo.insert_one(request_body)

            if not result:
                return JsonRes(info={}, usr_err_mes="MongoDB Insert Exception!",
                               status=False, data=[], code=400)
            else:
                return JsonRes(data={}, info={}, code=201)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Insert Exception!", status=False, data=[], code=400)

    def get(self):
        try:
            args = self.parser.parse(self.get_params_check, request)
            snapshot_name = args['snapshot_name']

            result = current_app.mongo.db.topo.find_one({
                'snapshot_name': snapshot_name
            })

            if not result:
                return JsonRes(info={}, usr_err_mes="No Snapshot named %s is found!" % snapshot_name, err_code=0,
                               status=False, data=[])
            else:
                return JsonRes(data=result, info={}, code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="data error!", status=False, data=[], code=400)

    def put(self):
        try:
            args = self.parser.parse(self.get_params_check, request)
            request_body = request.get_json()
            snapshot_name = args['snapshot_name']

            pre_record = current_app.mongo.db.topo.find_one({
                'snapshot_name': snapshot_name
            })
            if not pre_record:
                return JsonRes(info={}, usr_err_mes="No Snapshot named %s is found!" % snapshot_name, err_code=0,
                               status=False, data=[])

            result = current_app.mongo.db.topo.update(pre_record, {'$set': request_body})
            if not result:
                return JsonRes(info={}, usr_err_mes="MongoDB Update Exception!",
                               status=False, data=[], code=400)
            else:
                return JsonRes(data={}, info={}, code=201)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Update Exception!", status=False, data=[], code=400)

    def delete(self):
        try:
            args = self.parser.parse(self.get_params_check, request)
            snapshot_name = args['snapshot_name']

            result = current_app.mongo.db.topo.remove({
                'snapshot_name': snapshot_name
            })

            if result['n'] == 0:
                return JsonRes(info={}, usr_err_mes="No Topology named %s is found!" % snapshot_name, err_code=0,
                               status=False, data=[])
            else:
                return JsonRes(data={}, info={}, code=201)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Delete Exception!", status=False, data=[], code=400)


class Policy(BaseResource):

    def __init__(self):
        super().__init__()

        self.get_params_check = {
            "snapshot_name": fields.Str(load_from="snapshot_name", required=True),
            "id": fields.Str(load_from="id")
        }

    def snapshot_validate(self, snapshot_name):

        filter_dict = {
            "snapshot_name": snapshot_name
        }
        return has_record(current_app.mongo.db.snapshot, **filter_dict)

    def post(self):

        try:
            request_body = request.get_json()
            snapshot_name = request_body['snapshot_name']
            id = request_body['id']

            if not self.snapshot_validate(snapshot_name):
                return JsonRes(info={},
                               usr_err_mes="No Snapshot named %s is found! Please import snapshot first!" %
                                           snapshot_name,
                               err_code=0,
                               status=False, data=[])

            filter_dict = {
                "snapshot_name": snapshot_name,
                "id": id
            }
            if check_duplicated(current_app.mongo.db.policy, **filter_dict):
                return JsonRes(info={},
                               usr_err_mes="Duplicated Policy name in same Snapshot, please change another one!",
                               status=False, data=[], code=400)

            result = current_app.mongo.db.policy.insert_one(request_body)

            if not result:
                return JsonRes(info={}, usr_err_mes="MongoDB Insert Exception!",
                               status=False, data=[], code=400)
            else:
                return JsonRes(data={}, info={}, code=201)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Insert Exception!", status=False, data=[], code=400)

    def get(self):

        try:
            args = self.parser.parse(self.get_params_check, request)
            snapshot_name = args['snapshot_name']

            if not self.snapshot_validate(snapshot_name):
                return JsonRes(info={},
                               usr_err_mes="No Snapshot named %s is found! Please import snapshot first!" %
                                           snapshot_name,
                               err_code=0,
                               status=False, data=[])

            # return only one policy or return all policies in the snapshot
            if 'id' in args.keys():
                id = args['id']
                result = current_app.mongo.db.policy.find_one({
                    'snapshot_name': snapshot_name,
                    'id': id
                })

                if not result:
                    return JsonRes(info={},
                                   usr_err_mes="In Snapshot %s, no Policy named %s is found!" % (snapshot_name, id),
                                   err_code=0,
                                   status=False, data=[])
                else:
                    return JsonRes(data=result, info={}, code=200)
            else:
                result = current_app.mongo.db.policy.find({
                    'snapshot_name': snapshot_name
                })
                res_list = [policy for policy in result]

                return JsonRes(data=res_list, info={}, code=200)

        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="data error!", status=False, data=[], code=400)

    def put(self):

        try:
            args = self.parser.parse(self.get_params_check, request)
            request_body = request.get_json()
            snapshot_name = args['snapshot_name']
            id = args['id']

            if not self.snapshot_validate(snapshot_name):
                return JsonRes(info={},
                               usr_err_mes="No Snapshot named %s is found! Please import snapshot first!" %
                                           snapshot_name,
                               err_code=0,
                               status=False, data=[])

            filter_dict = {
                "snapshot_name": snapshot_name,
                "id": id
            }
            pre_record = current_app.mongo.db.policy.find_one(filter_dict)
            if not pre_record:
                return JsonRes(info={},
                               usr_err_mes="In Snapshot %s, No Policy named %s is found!" % (snapshot_name, id),
                               err_code=0, status=False, data=[])

            result = current_app.mongo.db.policy.update(pre_record, {'$set': request_body})
            if not result:
                return JsonRes(info={}, usr_err_mes="MongoDB Update Exception!",
                               status=False, data=[], code=400)
            else:
                return JsonRes(data={}, info={}, code=201)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Update Exception!", status=False, data=[], code=400)

    def delete(self):

        try:
            args = self.parser.parse(self.get_params_check, request)
            snapshot_name = args['snapshot_name']
            id = args['id']

            if not self.snapshot_validate(snapshot_name):
                return JsonRes(info={},
                               usr_err_mes="No Snapshot named %s is found! Please import snapshot first!" %
                                           snapshot_name,
                               err_code=0,
                               status=False, data=[])

            filter_dict = {
                "snapshot_name": snapshot_name,
                "id": id
            }
            result = current_app.mongo.db.policy.remove(filter_dict)

            if result['n'] == 0:
                return JsonRes(info={},
                               usr_err_mes="In Snapshot %s, No Policy named %s is found!" % (snapshot_name, id),
                               err_code=0, status=False, data=[])
            else:
                return JsonRes(data={}, info={}, code=201)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Delete Exception!", status=False, data=[], code=400)


class GlobalParmas(BaseResource):

    def __init__(self):
        super().__init__()

        self.get_params_check = {
            "snapshot_name": fields.Str(load_from="snapshot_name", required=True)
        }

    def snapshot_validate(self, snapshot_name):
        filter_dict = {
            "snapshot_name": snapshot_name
        }
        return has_record(current_app.mongo.db.snapshot, **filter_dict)

    def post(self):

        try:
            request_body = request.get_json()
            snapshot_name = request_body['snapshot_name']

            if not self.snapshot_validate(snapshot_name):
                return JsonRes(info={},
                               usr_err_mes="No Snapshot named %s is found! Please import snapshot first!" %
                                           snapshot_name,
                               err_code=0,
                               status=False, data=[])

            filter_dict = {
                "snapshot_name": snapshot_name,
            }
            if check_duplicated(current_app.mongo.db.params, **filter_dict):
                return JsonRes(info={},
                               usr_err_mes="Duplicated Snapshot name %s, please change another one!" % snapshot_name,
                               status=False, data=[], code=400)

            result = current_app.mongo.db.params.insert_one(request_body)
            if not result:
                return JsonRes(info={}, usr_err_mes="MongoDB Insert Exception!",
                               status=False, data=[], code=400)
            else:
                return JsonRes(data={}, info={}, code=201)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Insert Exception!", status=False, data=[], code=400)

    def get(self):
        try:
            args = self.parser.parse(self.get_params_check, request)
            snapshot_name = args['snapshot_name']

            if not self.snapshot_validate(snapshot_name):
                return JsonRes(info={},
                               usr_err_mes="No Snapshot named %s is found! Please import snapshot first!" %
                                           snapshot_name,
                               err_code=0,
                               status=False, data=[])

            result = current_app.mongo.db.params.find_one({
                'snapshot_name': snapshot_name
            })
            if not result:
                return JsonRes(info={}, usr_err_mes="In Snapshot %s, GlobalParams is Empty!" % snapshot_name,
                               err_code=0, status=False, data=[])
            else:
                return JsonRes(data=result, info={}, code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="data error!", status=False, data=[], code=400)

    def put(self):
        try:
            args = self.parser.parse(self.get_params_check, request)
            request_body = request.get_json()
            snapshot_name = args['snapshot_name']

            if not self.snapshot_validate(snapshot_name):
                return JsonRes(info={},
                               usr_err_mes="No Snapshot named %s is found! Please import snapshot first!" %
                                           snapshot_name,
                               err_code=0,
                               status=False, data=[])

            pre_record = current_app.mongo.db.params.find_one({
                'snapshot_name': snapshot_name
            })
            if not pre_record:
                return JsonRes(info={},
                               usr_err_mes="In Snapshot %s, GlobalParams is Empty, Nothing to Update!" % snapshot_name,
                               err_code=0, status=False, data=[])

            result = current_app.mongo.db.params.update(pre_record, {'$set': request_body})
            if not result:
                return JsonRes(info={}, usr_err_mes="MongoDB Update Exception!",
                               status=False, data=[], code=400)
            else:
                return JsonRes(data={}, info={}, code=201)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Update Exception!", status=False, data=[], code=400)

    def delete(self):
        try:
            args = self.parser.parse(self.get_params_check, request)
            snapshot_name = args['snapshot_name']

            if not self.snapshot_validate(snapshot_name):
                return JsonRes(info={},
                               usr_err_mes="No Snapshot named %s is found! Please import snapshot first!" %
                                           snapshot_name,
                               err_code=0,
                               status=False, data=[])

            result = current_app.mongo.db.params.remove({
                'snapshot_name': snapshot_name
            })

            if result['n'] == 0:
                return JsonRes(info={},
                               usr_err_mes="In Snapshot %s, GlobalParams is Empty, Nothing to Delete!" % snapshot_name,
                               err_code=0, status=False, data=[])
            else:
                return JsonRes(data={}, info={}, code=201)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Delete Exception!", status=False, data=[], code=400)


class Snapshot(BaseResource):

    def __init__(self):
        super().__init__()

        self.get_params_check = {
            "snapshot_name": fields.Str(load_from="snapshot_name", required=True)
        }

    def snapshot_validate(self, snapshot_name):
        filter_dict = {
            "snapshot_name": snapshot_name
        }
        return has_record(current_app.mongo.db.snapshot, **filter_dict)

    def post(self):

        try:
            request_body = request.get_json()
            snapshot_name = request_body['snapshot_name']

            filter_dict = {
                "snapshot_name": snapshot_name,
            }
            if check_duplicated(current_app.mongo.db.snapshot, **filter_dict):
                return JsonRes(info={},
                               usr_err_mes="Duplicated Snapshot name %s, please change another one!" % snapshot_name,
                               status=False, data=[], code=400)

            result = current_app.mongo.db.snapshot.insert_one(request_body)
            if not result:
                return JsonRes(info={}, usr_err_mes="MongoDB Insert Exception!",
                               status=False, data=[], code=400)
            else:
                return JsonRes(data={}, info={}, code=201)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Insert Exception!", status=False, data=[], code=400)

    def get(self):
        try:
            result = current_app.mongo.db.snapshot.find()
            res_list = [snapshot for snapshot in result]

            return JsonRes(data=res_list, info={}, code=200)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="data error!", status=False, data=[], code=400)

    def delete(self):
        try:
            args = self.parser.parse(self.get_params_check, request)
            snapshot_name = args['snapshot_name']

            result = current_app.mongo.db.snapshot.remove({
                'snapshot_name': snapshot_name
            })

            if result['n'] == 0:
                return JsonRes(info={},
                               usr_err_mes="No Snapshot named %s, Nothing to Delete!" % snapshot_name,
                               err_code=0, status=False, data=[])
            else:
                return JsonRes(data={}, info={}, code=201)
        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Delete Exception!", status=False, data=[], code=400)


class SnapshotUtils(BaseResource):

    def __init__(self):
        super().__init__()

        self.params_check = {
            "snapshot_name": fields.Str(load_from="snapshot_name", required=True),
            "operation": fields.Str(
                load_from='operation', required=True,
                validate=validate.OneOf(['import', 'export'])
            ),
            "with_params": fields.Bool(load_from='with_params', missing=False)
        }

        self.del_params_check = {
            "snapshot_name": fields.Str(load_from="snapshot_name", required=True)
        }

    def snapshot_validate(self, snapshot_name):
        filter_dict = {
            "snapshot_name": snapshot_name
        }
        return has_record(current_app.mongo.db.snapshot, **filter_dict)

    def post(self):

        try:
            args = self.parser.parse(self.params_check, request)
            request_body = request.get_json()

            snapshot_name = args['snapshot_name']
            operation = args['operation']

            if operation == "import":
                filter_dict = {
                    "snapshot_name": snapshot_name
                }
                if check_duplicated(current_app.mongo.db.snapshot, **filter_dict):
                    return JsonRes(info={}, usr_err_mes="Duplicated Snapshot name, please change another name!",
                                   status=False, data=[], code=400)

                # create snapshot instance
                snapshot_instance = {
                    'snapshot_name': snapshot_name
                }
                # snapshot_res = current_app.mongo.db.snapshot.insert_one(snapshot_instance)
                current_app.mongo.db.snapshot.insert_one(snapshot_instance)

                # create topo instances
                topo_instance = {
                    'snapshot_name': snapshot_name
                }
                if 'nodes' in request_body.keys():
                    topo_instance['nodes'] = request_body['nodes']
                    # topo_instance.update({
                    #     'nodes': request_body['nodes']
                    # })
                if 'links' in request_body.keys():
                    topo_instance['links'] = request_body['links']
                    # topo_instance.update({
                    #     'links': request_body['links']
                    # })
                # topo_res = current_app.mongo.db.topo.insert_one(topo_instance)
                current_app.mongo.db.topo.insert_one(topo_instance)

                # create policy instances
                if 'sr_policy' in request_body.keys():
                    sr_policies = request_body['sr_policy']
                    req_list = []
                    for policy in sr_policies:
                        policy_instance = {
                            'snapshot_name': snapshot_name
                        }
                        policy_instance.update(policy)
                        req_list.append(InsertOne(policy_instance))
                    # policies_res = current_app.mongo.db.policy.bulk_write(req_list)
                    current_app.mongo.db.policy.bulk_write(req_list)
                #
                # create global_params instances
                if 'global_params' in request_body.keys():
                    params_instance = {
                        'snapshot_name': snapshot_name
                    }
                    params_instance.update(request_body['global_params'])
                    # params_res = current_app.mongo.db.params.insert_one(params_instance)
                    current_app.mongo.db.params.insert_one(params_instance)

                return JsonRes(data={}, info={}, code=201)

            if operation == "export":

                if not self.snapshot_validate(snapshot_name):
                    return JsonRes(info={},
                                   usr_err_mes="No Snapshot named %s is found! Please import snapshot first!" %
                                               snapshot_name,
                                   err_code=0,
                                   status=False, data=[])

                topo_res = current_app.mongo.db.topo.find_one({
                    'snapshot_name': snapshot_name
                })
                del topo_res['snapshot_name']

                policy_res = current_app.mongo.db.policy.find({
                    'snapshot_name': snapshot_name
                })
                policy_list = []
                for policy in policy_res:
                    del policy['snapshot_name']
                    del policy['_id']
                    policy_list.append(policy)

                res = {
                    'nodes': topo_res['nodes'],
                    'links': topo_res['links'],
                    'sr_policy': policy_list
                }

                if 'with_params' in args.keys() and args['with_params']:
                    params_res = current_app.mongo.db.params.find_one({
                        'snapshot_name': snapshot_name
                    })
                    del params_res['snapshot_name']
                    del params_res['_id']

                    res.update({
                        'global_params': params_res
                    })

                return JsonRes(data=res, info={}, code=200)

        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Update Exception!", status=False, data=[], code=400)

    def delete(self):

        try:
            args = self.parser.parse(self.del_params_check, request)
            snapshot_name = args['snapshot_name']

            if not self.snapshot_validate(snapshot_name):
                return JsonRes(info={},
                               usr_err_mes="No Snapshot named %s is found! Please import snapshot first!" %
                                           snapshot_name,
                               err_code=0,
                               status=False, data=[])

            # snapshot_res = current_app.mongo.db.snapshot.remove({
            current_app.mongo.db.snapshot.remove({
                'snapshot_name': snapshot_name
            })
            # topo_res = current_app.mongo.db.topo.remove({
            current_app.mongo.db.topo.remove({
                'snapshot_name': snapshot_name
            })
            # policy_res = current_app.mongo.db.policy.remove({
            current_app.mongo.db.policy.remove({
                "snapshot_name": snapshot_name
            })
            # params_res = current_app.mongo.db.params.remove({
            current_app.mongo.db.params.remove({
                'snapshot_name': snapshot_name
            })

            return JsonRes(data={}, info={}, code=201)

        except Exception as e:
            LOG.debug(e)
            return JsonRes(info=e, usr_err_mes="MongoDB Operation Exception!", status=False, data=[], code=400)
