import logging
from cxpasta.utils.sort_utils import SortFactory
from cxpasta.utils.utils import filter_links, update_links_bw, update_links_flow, make_links, links_revert
from functools import cmp_to_key
from cxpasta.utils.pasta import Pasta

LOG = logging.getLogger(__name__)


class BaseAlgo:

    def __init__(self, nodes, links, sr_policy, **kwargs):
        # self.server = kwargs['server']
        # self.port = kwargs['port']
        self.nodes = nodes
        self.links = links
        self.sr_policy = sr_policy
        self.args = kwargs

    def calc_single(self):
        try:
            param_dict = {
                "nodes": self.nodes,
                "links": self.links,
                "sr_policy": self.sr_policy,
                "args": self.args
            }
            policy_req = self.assemble_req(**param_dict)
            LOG.debug('policy_req')
            LOG.debug(policy_req)

            res_data = self.pasta_call(policy_req)
            LOG.debug("after call pasta service")
            LOG.debug(res_data)

            if res_data['sids']:
                return {
                    'algo_type': self.algo_type,
                    'status': True,
                    'info': {},
                    'data': res_data
                }
            else:
                return {
                    'algo_type': self.algo_type,
                    'status': False,
                    'info': 'Path calculation failed, no path is available!',
                    'data': {}
                }

        except Exception as e:
            return {
                'algo_type': self.algo_type,
                'status': False,
                'info': e,
                'data': {}
            }

    def calc_multi(self):
        try:
            flow_factor = self.args['flow_factor']

            # 1. sort sr_policies
            if 'sorting' in self.args.keys():
                sort_method, reverse_type = SortFactory.get_method(self.args['sorting'])
                policies = sorted(self.sr_policy, key=cmp_to_key(sort_method.cmp_mtd), reverse=reverse_type)
            else:
                policies = self.sr_policy

            LOG.debug("after sorting policies")
            LOG.debug(policies)

            # 2. calc path for each policy and update the bw_rsv_left in related links
            status = True
            result_list = []

            for target_policy in policies:
                if 'algorithm' in target_policy.keys():
                    algorithm = target_policy['algorithm']
                    self.get_node_prefix(algorithm)

                param_dict = {
                    "nodes": self.nodes,
                    "links": self.links,
                    "sr_policy": target_policy,
                    "args": self.args
                }
                policy_req = self.assemble_req(**param_dict)
                res_data = self.pasta_call(policy_req)

                LOG.debug("after call pasta service")
                LOG.debug(res_data)

                if res_data['sids']:
                    result_list.append({
                        'id': target_policy['id'],
                        'data': res_data
                    })
                    # update bw_rsv_left in related links
                    self.links = self.update_links_efficient(self.links, res_data['segs'], 'bd',
                                                             target_policy['bd'], flow_factor,
                                                             method='SUBSTRACT')
                    LOG.debug("after update links efficient")
                    LOG.debug(self.links)
                else:
                    status = False
                    break

            if status is False:
                return {
                    'algo_type': self.algo_type,
                    'status': False,
                    'info': 'Path reoptimize calculation failed, paths are not available!',
                    'data': {}
                }
            else:
                return {
                    'algo_type': self.algo_type,
                    'status': True,
                    'info': {},
                    'data': result_list
                }
        except Exception as e:
            return {
                'algo_type': self.algo_type,
                'status': False,
                'info': e,
                'data': {}
            }

    def calc_mixed(self):
        try:
            flow_factor = self.args['flow_factor']
            policies = self.sr_policy
            status = True
            result_list = []

            for sr_policy in policies:
                if 'algorithm' in sr_policy.keys():
                    algorithm = sr_policy['algorithm']
                    self.get_node_prefix(algorithm)

                filter_dict = {'check_congest': True, 'policy_flow': sr_policy['traffic_flow'],
                               'bw_type': 'bandwidth_available', **self.args}
                err, target_links, ignored_links = filter_links(self.links, sr_policy['class'], **filter_dict)
                if err:
                    raise err
                if ignored_links:
                    sr_policy['exc'] = list(set(sr_policy['exc'] + ignored_links))
                LOG.debug('target_links')
                LOG.debug(target_links)
                LOG.debug('ignored_links')
                LOG.debug(ignored_links)
                LOG.debug('target_sr_policy')
                LOG.debug(sr_policy)

                param_dict = {
                    "nodes": self.nodes,
                    "links": target_links,
                    "sr_policy": sr_policy,
                    "args": self.args
                }
                policy_req = self.assemble_req(**param_dict)

                res_data = self.pasta_call(policy_req)
                LOG.debug("after call pasta service")
                LOG.debug(res_data)

                if res_data['sids']:
                    result_list.append({
                        'id': sr_policy['id'],
                        'data': res_data
                    })

                    # update traffic_flow in related links
                    self.links = update_links_flow(self.links, res_data['segs'],
                                                   sr_policy['traffic_flow'], flow_factor, method='PLUS')
                    LOG.debug('update_links_flow')
                    LOG.debug(self.links)
                    # update bandwidth_available in related links
                    self.links = update_links_bw(self.links, res_data['segs'], sr_policy['bd'],
                                                 sr_policy['class'], flow_factor, method='SUBSTRACT')
                    LOG.debug('update_links_bw')
                    LOG.debug(self.links)
                else:
                    status = False
                    break

            if status is False:
                return {
                    'algo_type': self.algo_type,
                    'status': False,
                    'info': 'Path congestion reoptimize calculation failed, paths are not available!',
                    'data': {}
                }
            else:
                return {
                    'algo_type': self.algo_type,
                    'status': True,
                    'info': {},
                    'data': result_list
                }
        except Exception as e:
            return {
                'algo_type': self.algo_type,
                'status': False,
                'info': e,
                'data': {}
            }

    def calc(self):
        if self.scenario == 'reopt':
            return self.calc_multi()
        elif self.scenario == 'congest':
            return self.calc_mixed()
        elif self.scenario == 'calc_only':
            return self.calc_single()

    def pasta_call(self, request_body):
        # headers = {'Content-Type': 'application/json'}
        # try:
        #     pasta_url = "http://%s:%s/api/pasta" % (self.server, self.port)
        #     resp = requests.post(url=pasta_url, data=json.dumps(request_body), headers=headers, timeout=60)
        # except Exception as e:
        #     LOG.debug(e)
        #     raise Exception(e)
        #
        # if resp.status_code >= 400:
        #     LOG.debug(resp.json())
        #     raise Exception(resp.json())
        # else:
        #     res = resp.json()
        #     return res

        data = Pasta(**request_body).run()
        return data

    def nonbod_calc_multi(self):
        try:
            policies = self. sr_policy

            # calc path for each policy
            status = True
            result_list = []
            for target_policy in policies:
                if 'algorithm' in target_policy.keys():
                    algorithm = target_policy['algorithm']
                    self.get_node_prefix(algorithm)

                param_dict = {
                    "nodes": self.nodes,
                    "links": self.links,
                    "sr_policy": target_policy,
                    "args": self.args
                }
                policy_req = self.assemble_req(**param_dict)
                res_data = self.pasta_call(policy_req)

                LOG.debug("after call pasta service")
                LOG.debug(res_data)

                if res_data['sids']:
                    result_list.append({
                        'id': target_policy['id'],
                        'data': res_data
                    })
                else:
                    status = False
                    break

            if status is False:
                return {
                    'algo_type': self.algo_type,
                    'status': False,
                    'info': 'Path reoptimize calculation failed, paths are not available!',
                    'data': {}
                }
            else:
                return {
                    'algo_type': self.algo_type,
                    'status': True,
                    'info': {},
                    'data': result_list
                }
        except Exception as e:
            return {
                'algo_type': self.algo_type,
                'status': False,
                'info': e,
                'data': {}
            }

    # def update_links(self, links, explicitPath, update_type, update_value, flow_factor, method='PLUS'):
    #
    #     modified_links = []
    #     for paths in explicitPath:
    #         ecmp_num = len(paths)
    #         for path in paths:
    #             for index in range(0, len(path), 2):
    #                 if index + 2 < len(path):
    #                     link_id = path[index + 1]
    #                     if link_id in modified_links:
    #                         continue
    #
    #                     for link in links:
    #                         if link['id'] == link_id:
    #                             if method == 'SUBSTRACT':
    #                                 link[update_type] -= (update_value * flow_factor) / ecmp_num
    #                             elif method == 'PLUS':
    #                                 link[update_type] += (update_value * flow_factor) / ecmp_num
    #
    #                             modified_links.append(link_id)
    #                             break
    #     return links

    def update_links_efficient(self, links, explicitPath, update_type, update_value, flow_factor, method='PLUS'):

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
                            if method == 'SUBSTRACT':
                                link[update_type] -= (update_value * flow_factor) / ecmp_num
                            elif method == 'PLUS':
                                link[update_type] += (update_value * flow_factor) / ecmp_num
                            # modified_links.append(link_id)

        return links_revert(links_efficient)

    def get_node_prefix(self, algorithm):
        for node in self.nodes:
            if 'prefix' in node.keys():
                sid = [
                    (prefix['prefix'], prefix['prefix_sid'])
                    for prefix in node['prefix'] if prefix['prefix_sid'] and prefix['prefix_algorithm'] == algorithm
                ]
                if sid:
                    node['ip'], node['sid'] = sid[0]


class General(BaseAlgo):

    def __init__(self, nodes, links, sr_policy, scenario, **kwargs):
        super(General, self).__init__(nodes, links, sr_policy, **kwargs)
        self.algo_type = 0
        self.scenario = scenario

    def calc_result(self, result):
        if self.scenario == 'reopt':
            result.append(self.calc_multi())
        elif self.scenario == 'congest':
            result.append(self.calc_mixed())
        elif self.scenario == 'calc_only':
            result.append(self.calc_single())

    def assemble_req(self, **params):
        policy_req = {'nodes': params['nodes'], 'links': params['links']}
        policy_req.update(params['sr_policy'])
        policy_req.update(params['args'])

        return policy_req


class NonSPF(BaseAlgo):

    def __init__(self, nodes, links, sr_policy, scenario, **kwargs):

        super(NonSPF, self).__init__(nodes, links, sr_policy, **kwargs)
        self.algo_type = 1
        self.scenario = scenario

    def calc_result(self, result):
        if self.scenario == 'reopt':
            result.append(self.calc_multi())
        elif self.scenario == 'congest':
            result.append(self.calc_mixed())
        elif self.scenario == 'calc_only':
            result.append(self.calc_single())

    def assemble_req(self, **params):
        policy_req = {'nodes': params['nodes'], 'links': params['links']}
        policy_req.update(params['sr_policy'])
        policy_req.update(params['args'])
        return policy_req


class NonBODNonSPF(BaseAlgo):

    def __init__(self, nodes, links, sr_policy, scenario, **kwargs):
        super(NonBODNonSPF, self).__init__(nodes, links, sr_policy, **kwargs)
        self.algo_type = 1
        self.scenario = scenario

    def calc_result(self, result):
        if self.scenario == 'reopt':
            result.append(self.nonbod_calc_multi())
        elif self.scenario == 'calc_only':
            result.append(self.calc_single())

    def assemble_req(self, **params):
        policy_req = {'nodes': params['nodes'], 'links': params['links']}
        policy_req.update(params['sr_policy'])
        policy_req.update(params['args'])
        return policy_req


class NonBODGeneral(BaseAlgo):

    def __init__(self, nodes, links, sr_policy, scenario, **kwargs):
        super(NonBODGeneral, self).__init__(nodes, links, sr_policy, **kwargs)
        self.algo_type = 0
        self.scenario = scenario

    def calc_result(self, result):
        if self.scenario == 'reopt':
            result.append(self.nonbod_calc_multi())
        elif self.scenario == 'calc_only':
            result.append(self.calc_single())

    def assemble_req(self, **params):
        policy_req = {'nodes': params['nodes'], 'links': params['links']}
        policy_req.update(params['sr_policy'])
        return policy_req


class AlgoFactory:

    @staticmethod
    def algorithm(algo_type, sr_type, nodes, links, sr_policy, scenario, **kwargs):

        if 0 == algo_type and sr_type == 'bod':
            return General(nodes, links, sr_policy, scenario, **kwargs)
        elif 1 == algo_type and sr_type == 'bod':
            return NonSPF(nodes, links, sr_policy, scenario, **kwargs)
        elif 0 == algo_type and sr_type == 'nonbod':
            return NonBODGeneral(nodes, links, sr_policy, scenario, **kwargs)
        elif 1 == algo_type and sr_type == 'nonbod':
            return NonBODNonSPF(nodes, links, sr_policy, scenario, **kwargs)
        else:
            LOG.debug('algo_type: ' + str(algo_type) + ', sr_type:' + sr_type)
            raise Exception('algorithm type or sr type is not valid.')
