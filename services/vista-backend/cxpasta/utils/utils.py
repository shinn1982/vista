import logging
import gevent
from functools import wraps
import time
import copy
import threading

LOG = logging.getLogger(__name__)


def filter_links(links, class_type, **kwargs):
    target_links = []
    ignored_links = []
    try:
        # get target links
        for link in links:
            ignored = False
            # congest optimize check
            if 'check_congest' in kwargs.keys():
                if kwargs['check_congest'] is True:
                    congest_threshold = kwargs['congest_threshold']
                    if link['traffic_flow'] + kwargs['policy_flow'] > link['bd'] * congest_threshold:
                        ignored = True
            # real traffic check
            if 'real_traffic' in kwargs.keys():
                if kwargs['real_traffic'] is True:
                    traffic_ratio = kwargs['traffic_ratio']
                    if link['traffic_flow'] > link['bd'] * traffic_ratio:
                        ignored = True
            if ignored is True:
                ignored_links.append(link['id'])

            has_class = False
            for class_item in link['qos_class']:
                if class_item['class'] == class_type:
                    bw_type = kwargs['bw_type']
                    bw = class_item[bw_type]
                    has_class = True
                    break

            if has_class is True:
                target_links.append(prune_link(link, bw))
            else:
                target_links.append(prune_link(link, 0))
    except Exception as e:
        return e, None, None
    return None, target_links, ignored_links


def nonbod_filter_links(links, **kwargs):
    target_links = []
    ignored_links = []
    try:
        # get target links
        for link in links:
            ignored = False

            # real traffic check
            if 'real_traffic' in kwargs.keys():
                if kwargs['real_traffic'] is True:
                    traffic_ratio = kwargs['traffic_ratio']
                    if link['traffic_flow'] > link['bd'] * traffic_ratio:
                        ignored = True
            if ignored is True:
                ignored_links.append(link['id'])
            target_links.append(prune_link(link, 0))
    except Exception as e:
        return e, None, None
    return None, target_links, ignored_links


def prune_link(source_link, class_bw):
    link = copy.deepcopy(source_link)
    link['bd'] = class_bw
    if 'qos_class' in link.keys():
        del link['qos_class']

    # link_attr = ['affinity', 'remote', 'sid', 'local', 'bandwidth', 'ip', 'te', 'id', 'delay', 'igp']
    # link = {}
    #
    # for attr in link_attr:
    #     if attr == 'bandwidth':
    #         link[attr] = class_bw
    #     else:
    #         if attr in source_link.keys():
    #             link[attr] = source_link[attr]

    return link


def execute_job(job_list, job_res_list):
    thread_list = []
    for i in range(len(job_list)):
        job = job_list[i]
        algorithm = job['algo_instance']
        t = threading.Thread(target=algorithm.calc_result, args=(job_res_list,))
        thread_list.append(t)
    for i in thread_list:
        i.start()
    for i in thread_list:
        i.join()
    return job_res_list


def execute_job_gevent(job_list, job_res_list):
    g_list = []
    for i in range(len(job_list)):
        job = job_list[i]
        algorithm = job['algo_instance']
        g_list.append(gevent.spawn(algorithm.calc_result, job_res_list))
    gevent.joinall(g_list)
    return job_res_list


def update_links_bw(links, explicitPath, bandwidth, qos_class, flow_factor, method='PLUS'):

    links_efficient = make_links(links)
    # modified_links = []
    for paths in explicitPath:
        ecmp_num = len(paths)
        for path in paths:
            for index in range(0, len(path), 2):
                if index + 2 < len(path):
                    link_id = path[index + 1]
                    # if link_id in modified_links:
                    #     continue

                    if link_id in links_efficient.keys():
                        link = links_efficient[link_id]
                        for class_item in link['qos_class']:
                            if class_item['class'] == qos_class:
                                if method == 'PLUS':
                                    class_item['bandwidth_available'] += (bandwidth * flow_factor) / ecmp_num
                                elif method == 'SUBSTRACT':
                                    class_item['bandwidth_available'] -= (bandwidth * flow_factor) / ecmp_num
                                # modified_links.append(link_id)
                                break
    return links_revert(links_efficient)


def update_links_flow(links, explicitPath, traffic_flow, flow_factor, method='PLUS'):

    links_efficient = make_links(links)
    # modified_links = []
    for paths in explicitPath:
        ecmp_num = len(paths)
        for path in paths:
            for index in range(0, len(path), 2):
                if index + 2 < len(path):
                    link_id = path[index + 1]
                    # if link_id in modified_links:
                    #     continue

                    if link_id in links_efficient.keys():
                        link = links_efficient[link_id]
                        if link['id'] == link_id:
                            if method == 'PLUS':
                                link['traffic_flow'] += (traffic_flow * flow_factor) / ecmp_num
                            elif method == 'SUBSTRACT':
                                link['traffic_flow'] -= (traffic_flow * flow_factor) / ecmp_num
                            # modified_links.append(link_id)
    return links_revert(links_efficient)


def check_related_path(sr_policy, target_link_id):
    explicitPath = sr_policy['path']

    is_related = False
    for paths in explicitPath:
        if is_related is False:
            for path in paths:
                if is_related is False:
                    for index in range(0, len(path), 2):
                        if index + 2 < len(path):
                            link_id = path[index + 1]
                            if link_id == target_link_id:
                                is_related = True
                                break

    return is_related


def sort_policies(pry_group, pry_pref, tr_pref):
    if pry_pref == 'LOW':
        pry_reverse = False
    else:
        pry_reverse = True

    if tr_pref == 'LOW':
        tr_reverse = False
    else:
        tr_reverse = True

    sorted_sr_policies = []
    for key in sorted(pry_group, reverse=pry_reverse):
        sr_policies = sorted(pry_group[key], key=lambda x: x['traffic_flow'], reverse=tr_reverse)
        sorted_sr_policies.append(sr_policies)

    return sorted_sr_policies


def sum_bw(sr_policies):
    bw_total = 0
    for sr_policy in sr_policies:
        bw_total += sr_policy['traffic_flow']

    return bw_total


def find_target_policies(priority_group, min_required):
    target_policies = []
    is_found = False
    for sr_policy in priority_group:
        if sr_policy['traffic_flow'] >= min_required:
            target_policies.append(sr_policy)
            is_found = True
            break
        else:
            target_policies.append(sr_policy)
            min_required -= sr_policy['traffic_flow']

    if is_found is True:
        return target_policies
    else:
        return []


def sort_options(reopt_options, **kwargs):
    pry_factor = kwargs['priority']
    bw_factor = kwargs['bandwidth']
    # num_factor = kwargs['number']
    min_required = kwargs['min_required']

    # remove duplicated options
    option_set = set()
    for option in reopt_options[0:]:
        item_tuple = tuple([item['id'] for item in option])
        if item_tuple in option_set:
            reopt_options.remove(option)
        else:
            option_set.add(item_tuple)

    LOG.debug('after remove duplicated item')
    LOG.debug(reopt_options)

    # estimate the effort for each option and sorting asc
    effort_dict = {}
    for option in reopt_options:
        effort = 0
        for sr_policy in option:
            pry_part = pry_factor * (1 / sr_policy['priority'])
            bw_part = bw_factor * (sr_policy['traffic_flow'] / min_required)
            # effort += pry_part + bw_part + num_factor
            effort += pry_part + bw_part
        if effort in effort_dict.keys():
            effort_dict[effort].append(option)
        else:
            effort_dict[effort] = [option]

    LOG.debug('effort_dict')
    LOG.debug(effort_dict)

    return [option for key in sorted(effort_dict) for option in effort_dict[key]]


def make_links(links):
    link_dict = {}
    for link in links:
        link_id = link['id']
        link_dict[link_id] = link
    return link_dict


def links_revert(links_efficient):
    return [link for link in links_efficient.values()]


def test_timing(func):
    @wraps(func)
    def func_timing(*args, **kwargs):
        s = time.time()
        LOG.debug("Start %s() call on %s" % (func.__name__, str(s)))
        # print("Start %s() call on %s" % (func.__name__, str(s)))
        ret = func(*args, **kwargs)
        e = time.time()
        LOG.debug("End %s() call on %s" % (func.__name__, str(e)))
        # print("End %s() call on %s" % (func.__name__, str(e)))
        LOG.debug("%s() execution %s" % (func.__name__, str(e - s)))
        # print("%s() execution %s" % (func.__name__, str(e - s)))
        return ret
    return func_timing
