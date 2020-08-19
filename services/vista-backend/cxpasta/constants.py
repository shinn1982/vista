# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

from cxcomm.i18n import _

TASK_TYPE_DICT = {
    'bod_pasta': "path_calculation_v2",
    'bod_modified': "path_modified",
    'nonbod_pasta': "nonbod_path_calculation",
    'bod_reopt': "reopt_global",
    'nonbod_reopt': "nonbod_reopt_global",
    'bod_congest_reopt': "reopt_congest_dispatch"
}

Bandwidth_KEY = 'bd'
Priority_KEY = 'priority'

Default_Snapshot = "Default"

Default_SPF_Params = {
    "algo": 0,
    "sorter": "metric",
    "top": 10,
    "limit": 0,
    "loose": False
}

Default_NonSPF_Params = {
    "algo": 1,
    "sorter": "metric",
    "top": 10,
    "limit": 0,
    "loose": True
}

Default_Global_Opt_Params = {
    "sorting": "bandwidth_desc",
    "flow_factor": 1.0,
    "real_traffic": False,
    "traffic_ratio": 1.0
}

Default_Congest_Opt_Params = {
    "reopt_mode": "loose",
    "flow_factor": 1.0,
    "real_traffic": False,
    "traffic_ratio": 1.0,
    "congest_threshold": 0.8,
    "target_threshold": 0.7,
    "prioriry_prefer": "HIGH",
    "traffic_prefer": "HIGH",
    "priority_weight": 0.5,
    "bandwidth_weight": 0.5
}

################################################
# General Constants
################################################
DEFAULT_USER_ERR_MES = _('Invalid input arguments.')


################################################
# Unused Constants Below
################################################

ACTION_DICT_1 = {
    'creator': {"bgp": 0, "netconf": 1},
    'create_backup': {False: 0, True: 1},
    'tlv_encoding': {"old": 0, "new": 1},
    'origin': {"IGP": 0, "BGP": 1, "INCOMPLETE": 2},
    'valid_check': {False: 0, True: 1},
    'target_type': {"PE": 0, "RR": 1},
    'generator': {"manual": 0, "topo": 1, "auto": 2, "local": 3},
    'append_type': {"ANY": 0, "EPE": 1},
    'facility_type': {"session": 0, "device": 1, "session group": 2, "device group": 3},
    'ready': {"delete": 0, "shutdown": 1, "nothing": 2},
    'stop': {"delete": 0, "shutdown": 1, "nothing": 2},
    'disable': {"delete": 0, "shutdown": 1, "nothing": 2},
    'bfd_enable': {False: 0, True: 1},
    'autoroute_enable': {False: 0, True: 1},
    'synchron_check': {False: 0, True: 1},
    'synchron_check_result': {False: 0, True: 1},
    'synchron_check_form': {'log': 0, 'sync': 1},
    'create_disjoin_path': {False: 0, True: 1},
    'metric_type': {"te": 0, "igp": 1, "latency": 2, "hopcount": 3},
    'group_type': {"link": 0, "node": 1, "srlg": 2, "srlg_node": 3},
    'is_backup': {False: 0, True: 1},
    'has_backup': {False: 0, True: 1},
    'prefix_type': {"self_defined": 0, "router_source": 1},
    'router_source_type': {"bgp": 0, "bmp": 1},
    'operation': {"res": 0, "add": 1, "del": 2, "alter": 3, "alter_all": 4},
    'nlri_filter_type': {"all": 0, "community": 1, "color": 2, "prefix": 3, "subnet": 4, "as_path_origin": 5,
                         "as_path_dest": 6, "as_path_through": 7},
    'nlri_flowspec': {"dest_prefix": "1", "source_prefix": "2", "ip_protocol": "3",
                      "source_or_dest_port": "4", "dest_port": "5", "source_port": "6", "icmp_typye": "7",
                      "icmp_code": "8", "dscp": "11"}
}

ACTION_DICT_2 = {
    'creator': {0: "bgp", 1: "netconf"},
    'create_backup': {0: False, 1: True},
    'tlv_encoding': {0: "old", 1: "new"},
    'origin': {0: "IGP", 1: "BGP", 2: "INCOMPLETE"},
    'valid_check': {0: False, 1: True},
    'target_type': {0: "PE", 1: "RR"},
    'generator': {0: "manual", 1: "topo", 2: "auto", 3: "local"},
    'append_type': {0: "ANY", 1: "EPE"},
    'facility_type': {0: "session", 1: "device", 2: "session group", 3: "device group"},
    'ready': {0: "delete", 1: "shutdown", 2: "nothing"},
    'stop': {0: "delete", 1: "shutdown", 2: "nothing"},
    'disable': {0: "delete", 1: "shutdown", 2: "nothing"},
    'bfd_enable': {0: False, 1: True},
    'autoroute_enable': {0: False, 1: True},
    'synchron_check': {0: False, 1: True},
    'synchron_check_form': {0: 'log', 1: 'sync'},
    'create_disjoin_path': {0: False, 1: True},
    'metric_type': {0: "te", 1: "igp", 2: "latency", 3: "hopcount"},
    'group_type': {0: "link", 1: "node", 2: "srlg", 3: "srlg_node"},
    'is_backup': {0: False, 1: True},
    'has_backup': {0: False, 1: True},
    'prefix_type': {0: "self_defined", 1: "router_source"},
    'router_source_type': {0: "bgp", 1: "bmp"},
    'operation': {0: "res", 1: "add", 2: "del", 3: "alter", 4: "alter_all", 5: 'delete_all'},
    'nlri_filter_type': {0: "all", 1: "community", 2: "color", 3: "prefix", 4: "subnet", 5: "as_path_origin",
                         6: "as_path_dest", 7: "as_path_through"},
    'nlri_flowspec': {1: "dest_prefix", 2: "source_prefix", 3: "ip_protocol", 4: "source_or_dest_port",
                      5: "dest_port", 6: "source_port", 7: "icmp_typye", 8: "icmp_code", 11: "dscp"}
}

ACTION_INVALID_REASON = {
    'bgp_sr': _('bgp_sr cannot be None.'),
    'segment_lists': _('segment_lists is compose of multi-segment_list, cannot be None.'),
    'condition': _('if segment_list generated by controller auto compute service, condition cannot be None.'),
    'target_facility': _('target_facility cannot be None.'),

    'name': _('action name is compose of chinese and english character, length not exceed 16.'),
    'label': _('every action label is compose of chinese and english character, length not exceed 11, the amount of '
               'labels not exceed 10.'),
    'description': _('action description is compose of chinese and english character, length not exceed 200.'),
    # 'creator': _('creator must be "bgp" or "netconf".'),
    # 'create_backup': _('create_backup must be true or false.'),
    'afi_safi': _('afi_safi must be "ipv4_srte".'),
    'synchron_check_form': _('synchron_check_form must be log/sync'),
    'headend': _('headend must be a valid ipv4 address.'),
    'endpoint': _('endpoint must be avlid ipv4 address.'),
    'tlv_encoding': _('tlv_encoding must be "old" or "new".'),
    # 'valid_check': _('valid_check must be true or false'),
    'target_type': _('target_type must be "PE" or "RR".'),
    'route_target': _('route_target is compose of an ipv4 address and a num which length not exceed 16, ip and number '
                      'is divided by a colon.'),
    'origin': _('origin must be "IGP" or "BGP" or "INCOMPLETE".'),
    'as_path': _('range of BGP AS is 0~65535, as_path performs like a string which is a series of blank divided AS.'),
    'community': _('"NO_ADVERTISE", "NO_EXPORT", "NO_EXPORT_SUBCONFED", "NOPEER", "planned_shut", "accept_own", '
                   '"ROUTE_FILTER_TRANSLATED_v4", "ROUTE_FILTER_v4", "ROUTE_FILTER_TRANSLATED_v6", "ROUTE_FILTER_v6" '
                   'is supported by our system.'),
    'color': _('color is an integer, range of color is 0~4294967295.'),
    'distinguisher': _('distinguisher is an integer, range of distinguisher is 0~4294967295.'),
    'b_sid': _('b_sid is an integer, range of b_sid is 16~1048575.'),
    'c_path_preference': _('c_path_preference is an integer, range of c_path_preference is 0~4294967295'),
    'local_preference': _('local_preference is an integer, range of local_preference is 0~4294967295'),
    'med': _('med is an integer, range of med is 0~4294967295'),
    'weight': _('weight is an integer, range of weight is 0~4294967295'),
    'generator': _('generator must be "manual", "topo" or "auto".'),
    'segment_list': _('segment is an integer which range is 0~1048575 or a valid ip, '
                      'segment_list is compose of multi-segment.'),
    'append_type': _('append_type must be "EPE" or "ANY".'),
    'append_sid': _('append_sid is an integer, range of append_sid is 0~1048575'),
    'backup_action_seg_list': _('segment is an integer, range of of segment is 0~1048575, '
                                'backup_action_seg_list is compose of multi-segment.'),
    'backup_preference': _('backup_preference is an integer, range of backup_preference is 0~4294967295.'),
    'bgp_as': _('bgp_as is an integer, range of bgp_as is 0~65535.'),
    # 'igp_protocol': _('igp_protocol must be ospf or isis.'),
    "igp_protocol": _('igp protocol must be one value of the list [1, 2, 3, 4, 5, 6, 7]'),
    'instance': _('instance is an integer, range of instance is 0~4294967295.'),
    # 'area': _('area must be integer(0~4294967295) or preforms like 0.0.0.0'),
    'area': _('area length not exceed 26.'),
    'algrithm': _('algrithm is an integer, range of algrithm is 0~4294967295.'),
    'source_node': _('headend is a valid ip address.'),
    'end_node': _('tailend is a valid ip address.'),
    'sr_algrithm': _('sr_algrithm is an integer, range of sr_algrithm is 0~4294967295.'),
    'path_algrithm': _('path algrithm must be SPF, CSPF or SC.'),
    # 'include_node_link': _('include_node_link performs like "4.4.4.4".'),
    # 'exclude_node_link': _('exclude_node_link performs like "4.4.4.4".'),
    # 'affinity_color': _('affinity_color is an integer, range of affinity_color is 0~4294967295.'),
    # 'affinity_mask': _('affinity_mask is an integer, range of affinity_mask is 0~4294967295.'),
    'metric': _('metric must be one of "igp", "te", "latency".'),
    'bandwidth': _('bandwidth is an integer, range of bandwidth is 0~4294967295.'),

    # target facility
    'facility_type': _('facility_type should be one of session, device, session group or device group.'),
    'session_facility': _('when facility_type is session, facility should be a session name.'),
    'device_facility': _('when facility_type is device, facility should be a device ip address.'),
    'session_group_facility': _('when facility_type is session group, facility should be a session group name.'),
    'device_group_facility': _('when facility_type is device group, facility should be a device group name.'),

    # netconf_sr
    'local_policy_name': _('action name is compose of chinese and english character, length not exceed 16.'),
    'ready': _('ready must be one of "shutdown", "delete" or "nothing".'),
    'stop': _('stop must be one of "shutdown", "delete" or "nothing".'),
    'disable': _('disable must be one of "shutdown", "delete" or "nothing".'),
    'multiplier': _('range of multiplier is 1~10.'),
    'multiplier_interval': _('range of multiplier_interval is 50~30000.'),
    'preference': _('range of preference is 0~4294967295.'),
    'netconf_generator': _('netconf_generator must be one of "manual", "topo", "auto" or "local".'),
    'segment_list_name': _('segment_list_name is compose of chinese and english character, length not exceed 16.'),
    'start_index': _('range of start_index is 0~65535.'),
    'index_interval': _('range of index_interval is 0~65535.'),
    'backup_c_path_seg_list': _('segment is an integer, range of of segment is 0~1048575, '
                                'backup_c_path_seg_list is compose of multi-segment.'),
    'backup_c_path_preference': _('range of index_interval is 0~4294967295.'),
    'metric_type': _('metric_type must be on of "te", "igp", "latency", "hopcount" .'),
    'metric_margin': _('metric_margin performs like "absolute:number" or "relative:number" , '
                       'if it is startwith absolute, the range of number is 0~2147483647, '
                       'else if it is startwith relative, range of the number is 0~100.'),
    'metric_sid_limit': _('range of metric_sid_limit is 0~255'),
    'disjoin_group_id': _('range of disjoin_group_id is 1~65535'),
    'group_type': _('group_type must be one of "node", "link", "srlg" or "srlg_node".'),
    'link_color': _('link color is startwith "include:" or "exclude:" or "exclude_all" and '
                    'followed by a serial of sting devided by comma.'),

    # ipv4 unicast
    'nexthop': _('nexthop must be a valid ipv4 address.'),
    'prefix_type': _('prefix_type must be 0 or 1.'),
    'device_ip': _('device_ip must be a valid ipv4 address.'),
    'router_source_type': _('router_source_type must be 0 or 1.'),
    'bmp_client_ip': _('bmp_client_ip must be a valid ipv4 address.'),
    'bmp_neighbor_ip': _('bmp_neighbor_ip must be a valid ipv4 address.'),
    'operation': _('operation must be 0-4.'),
    'type': _('type must be color or dmzlink_bw.'),
    'nlri_type': _('condition_type must be 1-7.')
}

ACTION_REGEX = {
    # action
    # 'name': r'^[a-zA-Z\u4e00-\u9fa5]{1,16}$',
    # 'label': r'^[a-zA-Z\u4e00-\u9fa5]{1,11}$',
    # 'description': r'^[a-zA-Z\u4e00-\u9fa5]{1,31}$',
    'name': r'^[a-zA-Z\u4e00-\u9fa50-9_-]{1,16}$',
    'label': r'^[a-zA-Z\u4e00-\u9fa50-9_-]{1,16}$',
    'description': r'^.{0,200}$',
    # 'creator': r'^((bgp)|(netconf))$',
    # 'create_backup': r'^((yes)|(no))$',
    'afi_safi': r'^(ipv4_srte)$',

    # bgp_sr
    'headend': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'endpoint': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'tlv_encoding': r'^((old)|(new))$',
    # 'valid_check': r'^((yes)|(no))$',
    'target_type': r'^((PE)|(RR))$',
    'route_target': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):'
                    r'\d{1,16}'
                    r'(\s((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):'
                    r'\d{1,16}))*$',
    'origin': r'^((IGP)|(BGP)|(INCOMPLETE))',
    'as_path': r'^(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])'
               r'(\s(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))*$',
    'community': r'^((([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|'
                 r'6553[0-5]):([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|'
                 r'6553[0-5]))|(PLANNED_SHUT)|(ACCEPT_OWN)|(ROUTE_FILTER_TRANSLATED_v4)|(ROUTE_FILTER_v4)|'
                 r'(ROUTE_FILTER_TRANSLATED_v6)|(ROUTE_FILTER_v6)|(NO_EXPORT)|(NO_ADVERTISE)|'
                 r'(NO_EXPORT_SUBCONFED)|(NOPEER))(\s(([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|'
                 r'65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]):([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|'
                 r'65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])|(PLANNED_SHUT)|(ACCEPT_OWN)|'
                 r'(ROUTE_FILTER_TRANSLATED_v4)|(ROUTE_FILTER_v4)|(ROUTE_FILTER_TRANSLATED_v6)|'
                 r'(ROUTE_FILTER_v6)|(NO_EXPORT)|(NO_ADVERTISE)|(NO_EXPORT_SUBCONFED)|(NOPEER)))*$',
    'color': (1, 4294967295),
    'distinguisher': (0, 4294967295),
    'b_sid': (16, 1048575),
    'c_path_preference': (1, 65535),
    'local_preference': (0, 4294967295),
    'med': (0, 4294967295),

    # segment_list
    'weight': (1, 4294967295),
    'generator': r'^((manual)|(topo)|(auto))$',
    'segment': (0, 1048575),
    'append_type': r'^((EPE)|(ANY))$',
    'append_sid': (0, 1048575),
    'backup_action_seg_list': (0, 1048575),
    'backup_preference': (1, 65535),

    # auto compute
    'bgp_as': (1, 65535),
    # 'igp_protocol': r'^((ospf)|(isis))$',
    'igp_protocol': (1, 7),
    'instance': (0, 4294967295),
    'area': r'(^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)|',
    'area_integer': (0, 4294967295),
    'algrithm': (0, 4294967295),
    'source_node': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'end_node': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'sr_algrithm': (0, 4294967295),
    'path_algrithm': r'^((SPF)|(CSPF)|(SC))$',
    # 'include_node_link':
    #     r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    # 'exclude_node_link':
    #     r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    # 'affinity': (0, 4294967295),
    # 'mask': (0, 4294967295),
    'metric': r'^((igp)|(te)|(latency))$',
    'bandwidth': (0, 4294967295),

    # target facility
    'facility_type': r'^((session)|(device)|(session group)|(device group))$',
    # 'session_group_facility': r'^[a-zA-Z\u4e00-\u9fa5]{1,16}$',
    # 'session_group_facility': r'^[a-zA-Z0-9]{1,16}$',
    'session_group_facility': r'^[a-zA-Z\u4e00-\u9fa50-9_-]{1,16}$',
    # 'device_facility': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',

    # netconf_sr
    'local_policy_name': r'^[a-zA-Z\u4e00-\u9fa5]{1,128}$',
    'ready': r'^(shutdown)|(delete)|(nothing)$',
    'stop': r'^(shutdown)|(delete)|(nothing)$',
    'disable': r'^(shutdown)|(delete)|(nothing)$',
    'multiplier': (1, 10),
    'multiplier_interval': (50, 30000),
    'preference': (1, 65535),
    'netconf_generator': r'^((manual)|(topo)|(auto)|(local))$',
    'segment_list_name': r'^[a-zA-Z\u4e00-\u9fa5]{1,128}$',
    'start_index': (1, 65535),
    'index_interval': (0, 65535),
    'segment_list': (0, 1048575),
    'backup_c_path_seg_list': (0, 1048575),
    'backup_c_path_preference': (1, 65535),
    'metric_type': r'^((te)|(igp)|(latency)|(hopcount))$',
    'metric_margin': r'^((absolute:((214748364[0-7])|(21474836[0-3][0-9])|(2147483[0-6][0-9]{2})|'
                     r'(214748[0-3][0-9]{3})|(21474[0-8][0-9]{4})|(2147[0-4][0-9]{5})|(214[0-7][0-9]{6})|'
                     r'(21[0-4][0-9]{7})|(2[0-1][0-9]{8})|([1-2][0-9]{9})|([1-9][0-9]{1,8})|([0-9])))|'
                     r'(relative:(100|[1-9][0-9]|[0-9])))$',
    'metric_sid_limit': (0, 255),
    'disjoin_group_id': (1, 65535),
    'group_type': r'^((link)|(node)|(srlg)|(srlg_node))$',
    'link_color': r'^((include)|(exclude)|(exclude_all)):(.+)(,.+)*$',

    # ipv4_unicast
    'nexthop': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'prefix_type': (0, 1),
    'device_ip': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'router_source_type': (0, 1),
    'bmp_client_ip': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'bmp_neighbor_ip': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'operation': (0, 5),
    'type': r'^((color)|(dmzlink_bw))$',
    'condition_type': (0, 7),

    # flowspec
    'dest_prefix': r'^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}'
                   r'(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/)([1-2][0-9]|[3][0-2]|[0-9]))$',
    'source_prefix': r'^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}'
                     r'(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/)([1-2][0-9]|[3][0-2]|[0-9]))$',
    'ip_protocol': r'^(=6)|(=17)|(=1)$',
    'source_or_dest_port': r'(((>=)|(<=)|=|>|<)(0|([1-9]\d{0,3})|([1-5]\d{0,4})|(6[0-4]\d{3})|'
                           r'(65[0-4]\d{2})|(655[0-2]\d)|(6553[0-5]))\|)*(((>=)|(<=)|=|>|<)(0|'
                           r'([1-9]\d{0,3})|([1-5]\d{0,4})|(6[0-4]\d{3})|(65[0-4]\d{2})|'
                           r'(655[0-2]\d)|(6553[0-5]))$)',
    'dest_port': r'(((>=)|(<=)|=|>|<)(0|([1-9]\d{0,3})|([1-5]\d{0,4})|(6[0-4]\d{3})|(65[0-4]\d{2})|'
                 r'(655[0-2]\d)|(6553[0-5]))\|)*(((>=)|(<=)|=|>|<)(0|([1-9]\d{0,3})|([1-5]\d{0,4})|'
                 r'(6[0-4]\d{3})|(65[0-4]\d{2})|(655[0-2]\d)|(6553[0-5]))$)',
    'source_port': r'(((>=)|(<=)|=|>|<)(0|([1-9]\d{0,3})|([1-5]\d{0,4})|(6[0-4]\d{3})|(65[0-4]\d{2})|'
                   r'(655[0-2]\d)|(6553[0-5]))\|)*(((>=)|(<=)|=|>|<)(0|([1-9]\d{0,3})|([1-5]\d{0,4})|'
                   r'(6[0-4]\d{3})|(65[0-4]\d{2})|(655[0-2]\d)|(6553[0-5]))$)',
    'icmp_type': r'^=0$|^=[1-9]\d{0,1}$|^=1\d{2}$|^=2[0-4]\d$|^=25[0-5]$',
    'icmp_code': r'^=0$|^=[1-9]\d{0,1}$|^=1\d{2}$|^=2[0-4]\d$|^=25[0-5]$',
    'dscp': r'(((>=)|(<=)|=|>|<)([0-9]|([1-5]\d{1})|(6[0-3]))\|)*(((>=)|(<=)|=|>|<)([0-9]|([1-5]\d{1})|'
            r'(6[0-3]))$)',
    'traffic_rate': r'^(0|([1-9]\d{0,8})|([1-3]\d{0,9})|(4[0-1]\d{8})|(42[0-8]\d{7})|(429[0-3]\d{6})|'
                    r'(4294[0-8]\d{5})|(42949[0-5]\d{4})|(429496[0-6]\d{3})|(4294967[0-1]\d{2})|(42949672\d[0-5]))$',
    'traffic_rate_unit': r'(bps)|(Mbps)|(Gbps)',
    'traffic_marking_dscp': r'0|([1-5]\d{1})|(6[0-3])',
    'redirect_to': r'(^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)'
                   r'|(^(0|([1-9]\d{0,3})|([1-5]\d{0,4})|(6[0-4]\d{3})|(65[0-4]\d{2})|(655[0-2]\d)|(6553[0-5])):'
                   r'(0|([1-9]\d{0,8})|([1-3]\d{0,9})|(4[0-1]\d{8})|(42[0-8]\d{7})|(429[0-3]\d{6})|(4294[0-8]\d{5})'
                   r'|(42949[0-5]\d{4})|(429496[0-6]\d{3})|(4294967[0-1]\d{2})|(42949672\d[0-5]))$)'
}

ACTION_TYPE = ["ipv4_sr", "netconf_sr", "ipv4_unicast", "ipv4_flowspec"]

DEVICE_REGEX = {
    'ip': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'name': r'^[a-zA-Z0-9_,-]{1,24}$',
    'netconf_paras': r'^[^\u4e00-\u9fa5]+$'
}

GROUP_REGEX = {
    'ip': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'name': r'^[0-9a-zA-Z\u4e00-\u9fa5_-]{1,16}$'
}

SESSION_REGEX = {
    'ip': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'session_name': r'^[0-9a-zA-Z\u4e00-\u9fa5_-]{1,16}$',
    'md5': r'^[a-zA-Z0-9]{0,80}$',
    'as_num': r'^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}'
              r'|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$',
}

TELEMETRY_REGEX = {
    "space_id": r'^[0-9a-zA-Z_-]{32,36}$',
    "headend_telemetry_ip": r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]'
                            r'|[01]?[0-9][0-9]?)$',
    "tailend_ip": r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]'
                            r'|[01]?[0-9][0-9]?)$',
    'color': (1, 4294967295),
    'as_num': r'^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}'
              r'|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$',

    "user_id": r'^[0-9a-zA-Z_-]{32,36}$',
    'preference': (1, 65535),
    'data_source': r'^((forwarding)|(policy))$',

}

TELEMETRY_INVALID_REASON = {
    'space_id': _('space id is a string compose of english character or "-", and length of id must be 32.'),
    'headend_telemetry_ip': _('headend telemetry ip address performs like "111.111.111.111".'),
    'tailend_ip': _('headend telemetry ip address performs like "111.111.111.111".'),
    'color': _('color is an integer, range of color is 0~4294967295.'),
    'as_num': _('as_num is an integer, range of as_num is 0~65535.'),
    'user_id': _('user id is a string compose of english character or "-", and length of id must be 32.'),
    'preference': _('preference is an integer, range of as_num is 1~65535.'),
    'data_source': _('data_source must be "forwarding" or "policy".'),
}

POLICY_REGEX = {
    # policy
    'name': r'^[0-9a-zA-Z\u4e00-\u9fa5_-]{1,16}$',
    'label': r'^[0-9a-zA-Z\u4e00-\u9fa5_-]{1,11}$',
    # 'description': r'^[0-9a-zA-Z\u4e00-\u9fa5]{1,31}$',
    'description': r'^.{0,200}$',
    'post_expected_status': r'^((advertise)|(created))$',
    'expected_status': r'^((advertise)|(withdraw)|(created)|(in_deleting))$',
    'created_by': r'^[0-9a-zA-Z\u4e00-\u9fa5_,-]{1,24}$',
    # schedule
    'schedule_status': r'^((inactive)|(ready)|(stop)|(active))$',
    'schedule_type': r'^((any)|(period)|(regular))$',
    'continue_time_unit': r'^((m)|(h)|(d))$',
    # conditions
    'rule': r'^((all)|(at_least_one))$',
    "priority": (1, 8),
    # sub conditions
    'condition_type': r'^((any)|(bgp_session_status)|(bmp_session_status)|(bgp_routes)|(bmp_routes)|(node)|(link))$',
    'sess_int_ip': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'operation': r'^((eq)|(ne)|(contains))$',
    'value': r'^((up)|(down)|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]'
             r'|2[0-4][0-9]|[01]?[0-9][0-9]?/([0-9]|[12][0-9]|3[0-2])){1,10})$',
    'match_rule': r'^((any)|(all))$',
    'condition_status': r'^((active)|(inactive)|(in_deleting))$',
    # actions
    'advertise_priority': (1, 10),
    "withdraw_priority": (1, 10),
    'condition_action_status': r'^((active)|(inactive)|(advertise_failed)|(withdraw_failed))$',
    'condition_action_admin_status': r'^((created)|(in_deleting))$',
    # id
    "id": r'^[0-9a-zA-Z_-]{32,36}$',
    # get policy
    'order': r'^((ASC)|(DESC))$',
    'order_by': r'^((id)|(name)|(label)|(description)|(expected_status)|(status)|(created_on)|(updated_on))$',
    # update policy
    'action': r'^((advertise)|(withdraw)|(redeploy))$',
}

POLICY_INVALID_REASON = {
    # policy
    'name': _('policy name is compose of chinese and english character, length not exceed 16.'),
    'label': _('every label is compose of chinese and english character, length not exceed 11, the amount of '
               'labels not exceed 10.'),
    'description': _('description is compose of chinese and english character, length not exceed 200.'),
    'created_by': _('username is compose of chinese and english character, length not exceed 24.'),
    'post_expected_status': _('expected_status must be "created" or "advertise" while creating a new policy.'),
    'expected_status': _('expected_status must be "created" or "advertise" or "withdraw" or "in_deleting".'),
    'status': _(
        'newly created policy status must be "10" and '
        'possible values is one of (10, 11, 12, 13, 20, 21, 22, 30, 31, 32, 40).'),
    # schedule
    'schedule_type': _('schedule_type must be "any" or "period" or "regular".'),
    'schedule_status': _('schedule_status must be "inactive" ,"ready" ,"stop" or "active".'),
    'crontab': _('crontab string is not available.'),
    'continue_time_unit': _(
        'continue_time_unit must be "m" or "h" or "d", and if "m",range of minutes is 0~365*24*60,'
        ' if "h", range of hours is 0~365*24), if "d", range of days is 0~365.'),
    # conditions
    'condition_status': _('condition status must be "active" or "inactive" or "in_deleting", '
                          'and newly created status must be "inactive".'),
    'rule': _('rule must be "all" or "at_least_one".'),
    'priority': _('length of conditions cannot exceed 8, therefore range of priority is 1~8.'),
    # sub conditions
    'condition_type': _(
        'condition_type must be "any" ,"bgp_session_status" ,"bmp_session_status" ,'
        '"bgp_routes" ,"bmp_routes" ,"node" or "link".'),
    'sess_int_ip': _('ip address performs like "4.4.4.4".'),
    'operation': _('operation must be "eq" ,"ne" or "contains".'),
    'value': _('value must be "up" ,"down" or performs like "192.168.11.1/24".'),
    'match_rule': _('match_rule must be "any" or "all".'),
    # actions
    'condition_action_status': _(
        'condition action status must be "active" or "inactive" or "in_deleting" or "advertise_failed" or'
        ' "withdraw_failed", and newly created status must be "inactive".'),
    'condition_action_admin_status': _('condition action admin status must be "created" or "in_deleting".'),
    'advertise_priority': _('length of actions cannot exceed 10, therefore range of advertise_priority is 1~10.'),
    'withdraw_priority': _('length of actions cannot exceed 10, therefore range of withdraw_priority is 1~10.'),
    # id
    'id': _('id is a string compose of english character or "-", and length of id must be 32.'),
    # order and order by
    'order': _('order must be "ASC" or "DESC".'),
    'order_by': _(
        '"id", "name", "label", "description", "expected_status", "status", '
        '"create_time", "update_time" is supported by our system.'),
    # others
    'lack_of_parameters': _('Lack of the necessary parameters.'),
    'action': _('action must be "advertise" , "withdraw" or "redeploy".'),
    'illegal_status': _('if action is "advertise", policy expected status must be "created" or "withdraw",'
                        'if action is "withdraw", policy expected status must be "advertise",'
                        'if action is "redeploy", policy expected status is no limit.'),
    'not_exist': _('policy not exist.'),
    'cannot_edit': _('Please note that you can only delete withdraw or created policy!'),
    'cannot_delete': _(
        'Please note that all policies under the specified space must be withdraw/created(13/10) status!'),
    'internal_error': _('Please contact your administrator for this internal error!'),
    'already_exist': _('Policy with this name already exist.'),
    'not_satisfy': _('Validation parameters are not quite satisfying.'),
    'no_space_id': _('There is no space_id in request parameters.'),
    'sub_condition_invalid': _('The sub condition input parameters could be off.'),
    'schedule_invalid': _('The schedule input parameters could be off.'),
    'node_sub_condition_not_exist': _('Node sub condition is not exist, please select a valid node.'),
    'link_sub_condition_not_exist': _('Link sub condition is not exist, please select a valid link.'),
    'bgp_session_not_exist': _('Bgp session is not exist, please select a bgp session.'),
    'bgp_session_server_error': _('Bgp session server error, please reach your administrator.'),
}

FORWARDING_API_INVALID_REASON = {
    'cfg_file_error': _('Configuration file error, please check your yaml configuration file!'),
    'pasta_api_error': _('Request PASTA api error, please check your PASTA Server!'),
    'telemetry_api_error': _('Request telemetry api error, please check your Telemetry Server!'),
    'topo_error': _('Request topology error, please reach your administrator!'),
    'device_not_found': _('Requested device cannot be found in this space!'),
}
REGEX_STRING = {
    'IP': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}'
          '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    'MASK': r'^([0-9]|[12][0-9]|3[0-2])$',
    'LOCAL_PREF': r'^[1-9]\d*$',
    'INT': r'^\d+$',
    'PORT': r'^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|'
            r'[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$',
    # 'DSCP': r'^(([1-6][0-3]?)|([1-5][0-9]?)|([0-9]?))$',
    # 'PASSWORD': r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!_@$%^&*-]).{8,}$',
    'PASSWORD': r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[#?!_@$%^&*-]).{8,30}$',
    'EMAIL': r'^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$',
    # 'USER_NAME': r'^(?!_)(?!.*?_$)[a-zA-Z0-9_]{3,24}$',
    'USER_NAME': r'^[a-zA-Z0-9_,-]{1,24}$',
    'PHONE_NUMBER': r'^[0-9]{1,15}$',
    'PROBE_NAME': r'^[a-zA-Z0-9_,-]{1,24}$',
    'PREFIX': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}'
              r'(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/)([1-2][0-9]|[3][0-2]|[0-9])$',
    # 'NAME': r'^(?!\s)([\u4e00-\u9fffa-zA-Z0-9_\s]){1,25}$',
    'IP_MASK': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]'
               r'|2[0-4][0-9]|[01]?[0-9][0-9]?)/([0-9]|[12][0-9]|3[0-2])$',
    'COMMENT': r'^[\u4e00-\u9fffa-zA-Z0-9_\s]+$',
    # 'SPACE_NAME': r'^[a-z0-9_-]{3,15}$'
    'NAME': r'^[\u4e00-\u9fa5a-zA-Z0-9_,-]{1,24}$',
    'ROUTE_TARGET': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):\d+$',
    'AS_PATH': r'^(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])'
               r'(,(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}'
               r'|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))*$',
    'DSCP': r'^(((>=)|(<=)|=|>|<)([0-9]|([1-5]\d{1})|(6[0-3]))\|)*((>=)|(<=)|=|>|<)([0-9]|([1-5]\d{1})|(6[0-3]))$',
    'DSCP_MAX': r'^(((>=)|(<=)|=|>|<)(0|([1-9]\d{0,3})|([1-5]\d{0,4})|(6[0-4]\d{3})|(65[0-4]\d{2})|(655[0-2]\d)'
                r'|(6553[0-5]))\|)*(((>=)|(<=)|=|>|<)(0|([1-9]\d{0,3})|([1-5]\d{0,4})|(6[0-4]\d{3})|(65[0-4]\d{2})'
                r'|(655[0-2]\d)|(6553[0-5]))$)',
    'AS': r'^(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])'
          r'(([.]{1})(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|'
          r'[0-9])){0,1}$'
}

topn_regex = {
    "unit": r'^((5min)|(hour)|(day)|(week)|(month))$',
    "order_by": r'^((rate)|(usage))$',
}

topn_reason = {
    "unit": "unit must be one of '5min', 'hour', 'day', 'week', 'month'.",
    "order_by": "order_by must be one of 'rate', 'usage'"
}

SPACE_ROLE_OWNER = 'owner'
SPACE_ROLE_ADMIN = 'admin'
SPACE_ROLE_OPERATOR = 'operator'

USER_TYPE_SYSTEM = 'system'
USER_TYPE_NORMAL = 'normal'
POLICY_EXPECT_STATUS = {
    "created": "created",
    "withdraw": "withdraw",
    "advertise": "advertise",
    "in_deleting": "in_deleting"
}

POLICY_STATUS = {
    "inactive_created": 10,
    "inactive_stop": 11,
    "inactive_failed": 12,
    "inactive_withdraw": 13,
    "active": 20,
    "active_partial": 21,
    "inactive_ready": 22,
    "in_deploying": 30,
    "in_withdrawing": 31,
    "in_advertising": 32,
    "failed": 40
}

POLICY_STATUS_1 = {
    10: "inactive_created",
    11: "inactive_stop",
    12: "inactive_failed",
    13: "inactive_withdraw",
    20: "active",
    21: "active_partial",
    22: "inactive_ready",
    30: "in_deploying",
    31: "in_withdrawing",
    32: "in_advertising",
    40: "failed"
}

SCHEDULE_TYPE = {
    "regular": "regular",
    "period": "period",
    "any": "any"
}

SCHEDULE_CONTINUE_TIME_UNIT = {
    "minutes": "m",
    "hours": "h",
    "days": "d"
}

SCHEDULE_CONTINUE_TIME = {
    "m": (0, 365 * 24 * 60),
    "h": (0, 365 * 24),
    "d": (0, 365)
}

SCHEDULE_STETE = {
    "created": "inactive",
    "ready": "ready",
    "stop": "stop",
    "active": "active"
}

CONDITION_STATUS = {
    "active": "active",
    "inactive": "inactive",
    "in_deleting": "in_deleting"
}

CONDITION_RULE = {
    "all": "all",
    "at_least_one": "at_least_one"
}

CONDITION_ACTION_STATUS = {
    "active": "active",
    "advertise_failed": "advertise_failed",
    "withdraw_failed": "withdraw_failed",
    "inactive": "inactive"
}

CONDITION_ACTION_ADMIN_STATUS = {
    "in_deleting": "in_deleting",
    "created": "created"
}

SUB_CONDITION_TYPE = {
    "any": "any",
    "bgp_session_status": "bgp_session_status",
    "bmp_session_status": "bmp_session_status",
    "bgp_routes": "bgp_routes",
    "bmp_routes": "bmp_routes",
    "node": "node",
    "link": "link"
}

SUB_CONDITION_OPERATION = {
    "eq": "eq",
    "ne": "ne",
    "contains": "contains"
}

SUB_CONDITION_SESSION_STATUS = {
    "up": "up",
    "down": "down"
}

SUB_CONDITION_ROUTE_RULE = {
    "any": "any",
    "all": "all"
}

FAILED = "failed"
SUCCESS = "success"

ESTABLISHED = "established"
UP = "up"
STATUS_UP = (ESTABLISHED, UP)

NETCONF_SYNC_RES = {
    "not_pass": 0,
    "pass": 1,
    "N/A": 2
}

# 0 pass 1 permission deny
CONTORL_FUNCTION = {
    "action": {"get": 0, 'post': 1, 'put': 1, 'delete': 1},
    "bgp_sr_action": {"get": 0, 'post': 1, 'put': 1, 'delete': 1},
    "netconf_sr_action": {"get": 0, 'post': 1, 'put': 1, 'delete': 1},
    "ipv4_unicast_action": {"get": 0, 'post': 1, 'put': 1, 'delete': 1},
    "devices": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "session": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "router_group": {"get": 0, 'post': 1, 'put': 1, 'delete': 1},
    "session_group": {"get": 0, 'post': 1, 'put': 1, 'delete': 1},
    "pasta": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "policies": {"get": 0, 'post': 1, 'put': 1, 'delete': 1},
    "policy_validation": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "space_user": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "user_space": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "bgp_sessions": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "bmp_sessions": {"get": 0, 'post': 1, 'put': 1, 'delete': 1},
    "docker_hosts": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "netconf_sessions": {"get": 0, 'post': 1, 'put': 1, 'delete': 1},
    "bmp_detail": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "bmp_device_ip": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "bmp_peer_ip": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "spaces": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "controller_sr_policies": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "controller_c_paths": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "sr_flows": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "path_visualization": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "path_visualization_infos": {"get": 0, 'post': 0, 'put': 0, 'delete': 0},
    "prefix_search": {'post': 1},
    "interfacetree": {"get": 0},
    "interface_traffic": {"get": 0},
    "interfaceqos_class": {"get": 0},
    "linkqos_class": {"get": 0},
    "traffic_group": {"get": 0, "post": 0, "delete": 0},
    "trafficgrouptree": {"get": 0},
    "interfacetopnclassdrop": {"get": 0},
    "grouptopnclassdrop": {"get": 0},
    "interfacetopntraffic": {"get": 0},
    "bmppeers": {"get": 2},
    "bgppeers": {"get": 2},
    "prefix": {"get": 2},
    "prefix_table": {"get": 2},
    "pr_ribattr": {"get": 2},
    "export": {"get": 2},
    "export_count": {"get": 2},
    "rb_ribattr": {"get": 2},
    "rb_ribcount": {"get": 2},
    "rb_ribprefix": {"get": 2},
    "sum": {"get": 2},
    "rt_ribattr": {"get": 2},
    "rt_ribprefix": {"get": 2}

}

PROFILE_KEY = 'fexbrx5dde7cs5md'
