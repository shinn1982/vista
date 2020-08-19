import logging
from itertools import combinations
from cxpasta.utils.algorithm_utils import AlgoFactory
from cxpasta.utils.utils import filter_links, check_related_path, sort_policies, update_links_bw, \
    update_links_flow, sort_options, make_links, execute_job_gevent, execute_job, nonbod_filter_links
import copy
import gevent
from cxpasta.celeryapp import app


LOG = logging.getLogger(__name__)


@app.task()
def path_calculation_v2(nodes, links, sr_policy, global_params):
    job_list = []
    result_list = []

    # if calc_type == 'calc_path':
    filter_dict = {'bw_type': 'bandwidth_available', **global_params}
    try:
        err, target_links, ignored_links = filter_links(links, sr_policy['class'], **filter_dict)

        if err:
            raise err

        if ignored_links:
            sr_policy['exc'] = list(set(sr_policy['exc'] + ignored_links))

        for algorithm in global_params['algorithm']:
            algo_type = algorithm['algo']

            algo_instance = AlgoFactory.algorithm(algo_type, 'bod', nodes, target_links, sr_policy, 'calc_only',
                                                  **algorithm)
            job = {
                'algo_type': algo_type,
                'algo_instance': algo_instance
            }
            job_list.append(job)

        result_list = execute_job(job_list, result_list)
        # result_list = execute_job_gevent(job_list, result_list)
        for res in result_list:
            updated_links = update_links_bw(copy.deepcopy(links), res['data']['segs'], sr_policy['bd'],
                                            sr_policy['class'], global_params['flow_factor'], method='SUBSTRACT')
            res['nodes'] = nodes
            res['links'] = updated_links

            if 'other' in res['data'].keys() and res['data']['other']:
                for other_res in res['data']['other']:
                    other_updated_links = update_links_bw(copy.deepcopy(links), other_res['segs'], sr_policy['bd'],
                                                          sr_policy['class'], global_params['flow_factor'],
                                                          method='SUBSTRACT')
                    other_res['nodes'] = nodes
                    other_res['links'] = other_updated_links

        return {
            "info": {},
            "data": result_list
        }
    except Exception as e:
        return {
            "info": e,
            "data": {}
        }


@app.task()
def path_modified(request_body):
    nodes = request_body['nodes']
    links = request_body['links']
    sr_policy = request_body['sr_policy']
    global_params = request_body['global']
    former_policy = sr_policy['former']
    path = former_policy['path']

    links = update_links_bw(links, path, former_policy['bd'], former_policy['class'],
                            global_params['flow_factor'], method='PLUS')
    result = path_calculation_v2(nodes, links, sr_policy, global_params)
    return result


@app.task()
def nonbod_path_calculation(nodes, links, sr_policy, global_params):
    job_list = []
    result_list = []

    try:
        err, target_links, ignored_links = nonbod_filter_links(links, **global_params)

        if err:
            raise err

        if ignored_links:
            sr_policy['exc'] = list(set(sr_policy['exc'] + ignored_links))

        for algorithm in global_params['algorithm']:
            algo_type = algorithm['algo']

            algo_instance = AlgoFactory.algorithm(algo_type, 'nonbod', nodes, target_links, sr_policy, 'calc_only',
                                                  **algorithm)
            job = {
                'algo_type': algo_type,
                'algo_instance': algo_instance
            }
            job_list.append(job)

        result_list = execute_job(job_list, result_list)
        # result_list = execute_job_gevent(job_list, result_list)

        for result in result_list:
            result['nodes'] = nodes
            result['links'] = links

        return {
            "info": {},
            "data": result_list
        }
    except Exception as e:
        return {
            "info": e,
            "data": {}
        }


@app.task()
def reopt_global(request_body):
    try:
        nodes = request_body['nodes']
        links = request_body['links']
        sr_policies = request_body['sr_policy']
        global_params = request_body['global']
        classified_policies = {}
        classified_links = {}

        # 1. 对所有bod sr_policies，根据qos_class进行分类；对所有的links，按照qos_class进行过滤
        for sr_policy in sr_policies:
            qos_class = sr_policy['class']
            if qos_class in classified_policies.keys():
                classified_policies[qos_class].append(sr_policy)
            else:
                classified_policies[qos_class] = [sr_policy]

        for qos_class in classified_policies.keys():
            filter_dict = {'bw_type': 'bandwidth_reserve', **global_params}
            err, target_links, ignored_links = filter_links(links, qos_class, **filter_dict)
            if err:
                raise err
            if ignored_links:
                target_policies = classified_policies[qos_class]
                for target_policy in target_policies:
                    target_policy['exc'] = list(set(target_policy['exc'] + ignored_links))

            classified_links[qos_class] = target_links

        # 2. 将不同的（algorithm，classified_sr_policies）封装成job任务，进行独立计算
        # server, port = current_app.configs["pasta_ip"], str(current_app.configs["pasta_port"])
        job_list = []
        job_res_list = []
        for algorithm in global_params['algorithm']:
            algo_type = algorithm['algo']

            for qos_class in classified_policies.keys():
                target_links = classified_links[qos_class]
                target_sr_policies = classified_policies[qos_class]
                copy_links = copy.deepcopy(target_links)
                algorithm['sorting'] = global_params['sorting']
                algorithm['flow_factor'] = global_params['flow_factor']

                algo_instance = AlgoFactory.algorithm(algo_type, 'bod', nodes, copy_links, target_sr_policies,
                                                      'reopt', **algorithm)
                job = {
                    'algo_type': algo_type,
                    'algo_instance': algo_instance
                }
                job_list.append(job)

        # job_res_list = execute_job(job_list, job_res_list)
        job_res_list = execute_job_gevent(job_list, job_res_list)

        result_list = []
        for algorithm in global_params['algorithm']:
            algo_type = algorithm['algo']
            res = {
                'algo_type': algo_type,
                'status': True,
                'info': {},
                'data': []
            }
            for result in job_res_list:
                LOG.debug(result)
                if result['algo_type'] == algo_type:
                    if result['status'] is False:
                        res['status'] = False
                        res['info'] = result['info']
                        res['data'] = None
                        break
                    else:
                        if isinstance(result['data'], list):
                            res['data'].extend(result['data'])
                        else:
                            res['data'].append(result['data'])
            result_list.append(res)

        return {
            "info": {},
            "data": result_list
        }
    except Exception as e:
        return {
            "info": e,
            "data": {}
        }


@app.task()
def nonbod_reopt_global(request_body):
    try:
        nodes = request_body['nodes']
        links = request_body['links']
        sr_policies = request_body['sr_policy']
        global_params = request_body['global']

        # server, port = current_app.configs["pasta_ip"], str(current_app.configs["pasta_port"])
        job_list = []
        job_res_list = []
        for algorithm in global_params['algorithm']:
            algo_type = algorithm['algo']
            algo_instance = AlgoFactory.algorithm(algo_type, 'nonbod', nodes, links, sr_policies,
                                                  'reopt', **algorithm)
            job = {
                'algo_type': algo_type,
                'algo_instance': algo_instance
            }
            job_list.append(job)

        # job_res_list = execute_job(job_list, job_res_list)
        job_res_list = execute_job_gevent(job_list, job_res_list)

        result_list = []
        for algorithm in global_params['algorithm']:
            algo_type = algorithm['algo']
            res = {
                'algo_type': algo_type,
                'status': True,
                'info': {},
                'data': []
            }
            for result in job_res_list:
                LOG.debug(result)
                if result['algo_type'] == algo_type:
                    if result['status'] is False:
                        res['status'] = False
                        res['info'] = result['info']
                        res['data'] = None
                        break
                    else:
                        if isinstance(result['data'], list):
                            res['data'].extend(result['data'])
                        else:
                            res['data'].append(result['data'])
            result_list.append(res)

        return {
            "info": {},
            "data": result_list
        }
    except Exception as e:
        return {
            "info": e,
            "data": {}
        }


@app.task()
def reopt_congest_dispatch(request_body):
    try:
        nodes = request_body['nodes']
        links = request_body['links']
        sr_policies = request_body['sr_policy']
        global_params = request_body['global']
        congest_links = request_body['congested_link']

        g_list = []
        for algorithm in global_params['algorithm'][0:]:
            copy_global = copy.deepcopy(global_params)
            copy_global['algorithm'] = [algorithm]
            copy_links = copy.deepcopy(links)
            g_list.append(
                gevent.spawn(reopt_congest_multi, algorithm['algo'], nodes, copy_links,
                             sr_policies, copy_global, congest_links)
            )
        gevent.joinall(g_list)

        result_list = []
        for g in g_list:
            result_list.append(g.value)

        return {
            "info": {},
            "data": result_list
        }

    except Exception as e:
        return {
            "info": e,
            "data": {}
        }


# congest_reoptimize to support multi congested links
def reopt_congest_multi(algo_type, nodes, links, sr_policies, global_params, congest_links):

    try:
        validate_congest_links(links, congest_links, global_params['congest_threshold'])

        # algo_type = global_params['algorithm'][0]['algo']
        reopt_result = []
        while congest_links:
            congest_link_id = get_top_congest(links, set(congest_links))
            LOG.debug('top congest link')
            LOG.debug(congest_link_id)
            if congest_link_id is None:
                raise Exception('Please check the link_ids in <congested_links> attribute are valid.')

            result = reopt_congest_single(nodes, links, sr_policies, global_params, congest_link_id)
            LOG.debug('reoptimize result for single congested link')
            LOG.debug(result)

            LOG.debug('link status, after reoptimize one congested link')
            LOG.debug(links)

            if result.get("info"):
                if global_params['reopt_mode'] == 'strict':
                    return {
                        "algo_type": algo_type,
                        "status": False,
                        "info": {
                            'message': 'Congest reoptimize failed, No result!',
                        },
                        "data": {}
                    }
                elif global_params['reopt_mode'] == 'loose':
                    if reopt_result:
                        return {
                            "algo_type": algo_type,
                            "status": False,
                            "info": {
                                'message': 'Congest reoptimize failed, No result!'
                            },
                            "data": reopt_result
                        }
                    else:
                        return {
                            "algo_type": algo_type,
                            "status": False,
                            "info": {
                                'message': 'Congest reoptimize failed, No result!'
                            },
                            "data": {}
                        }
            else:
                for reopted_sr_policy in result['data']:
                    reopt_result.append(reopted_sr_policy)
                    links = adjust_links_status(links, sr_policies, reopted_sr_policy, global_params['flow_factor'])
                    LOG.debug('after adjust links status')
                    LOG.debug(links)

                LOG.debug('before adjust congested links')
                LOG.debug(congest_links)
                congest_links = adjust_congested_links(links, set(congest_links), global_params['congest_threshold'])
                LOG.debug('after adjust congested links')
                LOG.debug(congest_links)

        return {
            "algo_type": algo_type,
            "status": True,
            "info": {},
            "data": reopt_result
        }
    except Exception as e:
        return {
            "algo_type": algo_type,
            "status": False,
            "info": e,
            "data": {}
        }


# operations for reoptimize one congested link
def reopt_congest_single(nodes, links, sr_policies, global_params, cong_link_id):
    # 1. 计算需要的最小带宽,min_required
    min_required = 0
    target_threshold = global_params['target_threshold']
    for link in links:
        if link['id'] == cong_link_id:
            min_required = link['traffic_flow'] - link['bd'] * target_threshold
            break
    LOG.debug('min_required')
    LOG.debug(min_required)

    # 2. 将链路相关的sr_policy过滤（是否可被优化），并按照优先级进行分组
    pry_group = {}
    for sr_policy in sr_policies:
        # check if the sr_policy related to congest_link
        if sr_policy['priority'] > 0 and check_related_path(sr_policy, cong_link_id):
            priority = sr_policy['priority']
            if priority in pry_group.keys():
                pry_group[priority].append(sr_policy)
            else:
                pry_group[priority] = [sr_policy]

    mixed_group = []
    for key in pry_group.keys():
        mixed_group.extend(pry_group[key])
    pry_group[0] = mixed_group

    LOG.debug('pry_group')
    LOG.debug(pry_group)

    # 3.按照优先级排序分组，组内sr_policy按照实际流量排序
    priority_prefer = global_params['prioriry_prefer']
    traffic_prefer = global_params['traffic_prefer']

    sorted_sr_policies = sort_policies(pry_group, priority_prefer, traffic_prefer)
    LOG.debug('sorted_sr_policies')
    LOG.debug(sorted_sr_policies)

    reopt_options = []
    # 4. 在各个组内挑选candidate sr_policies，并将并将结果放入reopt_options中
    for priority_group in sorted_sr_policies:
        # group_total_bw = sum_bw(priority_group)
        group_total_bw = sum([sr_policy['traffic_flow'] for sr_policy in priority_group])
        if group_total_bw >= min_required:
            candidates = []
            for i in range(1, len(priority_group) + 1):
                candidates.extend(list(combinations(priority_group, i)))
            for comb in candidates:
                total_traffic = sum(item['traffic_flow'] for item in comb)
                if total_traffic > min_required:
                    reopt_options.append(comb)

    LOG.debug('before sorted, reopt_options')
    LOG.debug(reopt_options)

    param_dict = {'priority': global_params['priority_weight'],
                  'bandwidth': global_params['bandwidth_weight'],
                  'min_required': min_required}
    reopt_options = sort_options(reopt_options, **param_dict)

    LOG.debug('after sorted, reopt_options')
    LOG.debug(reopt_options)

    for target_policies in reopt_options:

        # 5. 需要将目标sr_policies的预留可用带宽还原，同时将实际流量还原，将拥塞路径加到exclude条件中
        for sr_policy in target_policies:
            sr_policy['exc'] = sr_policy['exc'] + [cong_link_id]

            links = update_links_bw(links, sr_policy['path'], sr_policy['bd'], sr_policy['class'],
                                    global_params['flow_factor'], method='PLUS')

            links = update_links_flow(links, sr_policy['path'], sr_policy['traffic_flow'],
                                      global_params['flow_factor'], method='SUBSTRACT')
        LOG.debug('initial restore_links')
        LOG.debug(links)

        # 6. 重算目标sr_policies的结果
        # server, port = current_app.configs["pasta_ip"], str(current_app.configs["pasta_port"])
        job_res_list = []
        algorithm = global_params['algorithm'][0]
        algo_type = algorithm['algo']
        copy_links = copy.deepcopy(links)
        algorithm['flow_factor'] = global_params['flow_factor']
        algorithm['real_traffic'] = global_params['real_traffic']
        algorithm['traffic_ratio'] = global_params['traffic_ratio']
        algorithm['congest_threshold'] = global_params['congest_threshold']
        algorithm['target_threshold'] = global_params['target_threshold']

        algo_instance = AlgoFactory.algorithm(algo_type, 'bod', nodes, copy_links, target_policies,
                                              'congest', **algorithm)
        algo_instance.calc_result(job_res_list)
        LOG.debug('job_result')
        LOG.debug(job_res_list)

        reopt_status = True
        result_list = []

        result = job_res_list[0]
        LOG.debug(result)
        if result['status'] is False:
            reopt_status = False
        else:
            if isinstance(result['data'], list):
                result_list.extend(result['data'])
            else:
                result_list.append(result['data'])

        if reopt_status is False:
            for sr_policy in target_policies:
                links = update_links_bw(links, sr_policy['path'], sr_policy['bd'], sr_policy['class'],
                                        global_params['flow_factor'], method='SUBSTRACT')

                links = update_links_flow(links, sr_policy['path'], sr_policy['traffic_flow'],
                                          global_params['flow_factor'], method='PLUS')
            LOG.debug('congest reoptimize failed, restore_links:')
            LOG.debug(links)
        else:
            LOG.debug('final status of links:')
            LOG.debug(links)
            return {
                "info": {},
                "data": result_list
            }
    return {
        "info": {
            'message': 'Congest reoptimize failed, No result!'
        },
        "data": {}
    }


def validate_congest_links(links, congest_links, congest_threshold):

    link_dict = make_links(links)
    for link_id in congest_links:
        if link_id not in link_dict.keys():
            raise Exception('Link - ' + link_id + ' is not valid.')

        link = link_dict[link_id]
        if link['traffic_flow'] < link['bd'] * congest_threshold:
            raise Exception(
                'Link - ' + link_id + ' is not congested, please double check the <traffic_flow> attribute.')


def get_top_congest(links, congest_links):
    max_congest_rate = 0
    top_congest_link = None
    for link in links:
        if link['id'] in congest_links:
            congest_rate = link['traffic_flow'] / link['bd']
            if congest_rate > max_congest_rate:
                max_congest_rate = congest_rate
                top_congest_link = link
    if top_congest_link is not None:
        return top_congest_link['id']
    else:
        return None


def adjust_links_status(links, sr_policies, reopted_sr_policy, flow_factor):
    for old_sr_policy in sr_policies:
        if old_sr_policy['id'] == reopted_sr_policy['id']:
            # update new path's bw and traffic
            links = update_links_bw(links, reopted_sr_policy['data']['segs'], old_sr_policy['bd'],
                                    old_sr_policy['class'], flow_factor, method='SUBSTRACT')
            links = update_links_flow(links, reopted_sr_policy['data']['segs'], old_sr_policy['traffic_flow'],
                                      flow_factor, method='PLUS')
    return links


def adjust_congested_links(links, congested_links, threshold):
    for link in links:
        if link['id'] in congested_links:
            if link['traffic_flow'] <= link['bd'] * threshold:
                congested_links.remove(link['id'])

    return list(congested_links)


# def commit_path_changes(request_body):
#     # step1 restore the bandwidth_available of the related links
#     links = request_body['links']
#     sr_policy = request_body['sr_policy']
#     action_type = request_body['type']
#     flow_factor = request_body['flow_factor']
#
#     explicitPath = sr_policy['path']
#     bandwidth = sr_policy['bandwidth']
#     qos_class = sr_policy['class']
#
#     LOG.debug(action_type)
#     LOG.debug('before update links')
#     LOG.debug(links)
#
#     if action_type == 'create':
#         links = update_links_bw(links, explicitPath, bandwidth, qos_class, flow_factor, method='SUBSTRACT')
#
#     elif action_type == 'modify':
#         former_path = sr_policy['former']['path']
#         former_bandwidth = sr_policy['former']['bandwidth']
#         links = update_links_bw(links, former_path, former_bandwidth, qos_class, flow_factor, method='PLUS')
#         links = update_links_bw(links, explicitPath, bandwidth, qos_class, flow_factor, method='SUBSTRACT')
#
#     elif action_type == 'delete':
#         links = update_links_bw(links, explicitPath, bandwidth, qos_class, flow_factor, method='PLUS')
#
#     LOG.debug('after update links')
#     LOG.debug(links)
#
#     # step2 store links back to the database
#
#     data = {
#         "links": links
#     }
#
#     return data


# def reopt_commit_changes(request_body):
#     # step1 restore the bandwidth_available of the related links
#     links = request_body['links']
#     sr_policies = request_body['sr_policy']
#     flow_factor = request_body['flow_factor']
#
#     # To sr_policy in updated_seg_list:
#     # step1 update seg_list and path in db and commit changes to Version_Obj
#     # step2 update link_bw_rsv model and persistence in db
#     update_seg_list = []
#
#     # To sr_policy in updated_explict_path:
#     # step1 only update path in db
#     # step2 update link_bw_rsv model and persistence in db
#     update_explict_path = []
#
#     for sr_policy in sr_policies:
#         explicitPath = sr_policy['path']
#         seg_list = sr_policy['segment_list']
#         former = sr_policy['former']
#
#         if seg_list != former['segment_list']:
#             update_seg_list.append(sr_policy)
#         elif explicitPath != former['path']:
#             update_explict_path.append(sr_policy)
#
#     # update_seg_list, update seg_list and path in db and commit changes to Version_Obj
#     # updated_explict_path, only update path in db
#
#     LOG.debug('update_seg_list:')
#     LOG.debug(update_seg_list)
#
#     LOG.debug('update_explict_path:')
#     LOG.debug(update_explict_path)
#
#     # update link_bw_rsv model
#     update_explict_path.extend(update_seg_list)
#     for sr_policy in update_explict_path:
#         qos_class = sr_policy['class']
#
#         explicitPath = sr_policy['path']
#         bandwidth = sr_policy['bandwidth']
#         former_path = sr_policy['former']['path']
#         former_bandwidth = sr_policy['former']['bandwidth']
#
#         # LOG.debug('before update links')
#         # LOG.debug(links)
#
#         links = update_links_bw(links, former_path, former_bandwidth, qos_class, flow_factor, method='PLUS')
#         links = update_links_bw(links, explicitPath, bandwidth, qos_class, flow_factor, method='SUBSTRACT')
#
#         # LOG.debug('after update links')
#         # LOG.debug(links)
#
#     # persistence link_bw_rsv model in db
#
#     data = {
#         "links": links
#     }
#
#     return data
