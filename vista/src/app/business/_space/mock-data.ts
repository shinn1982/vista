export const MOCK_DATA = {
  'status': true,
  'info': {},
  'data': {
    'data_list': [
      {
        'id': '31961438fbe0426a93512b48af77552a',
        'space_name': 'demo_191',
        'space_alias': null,
        'updated_on': '2020 - 08 - 03T17: 09: 25Z',
        'filter': null,
        'created_on': '2019 - 11 - 07T18: 24: 53Z',
        'description': null,
        'bandwidth_threshold': 90,
        'role': 'owner',
        'sr_topo': {},
        'user_num': 9,
        'node_name_regex_list': [
          {
            'id': '3a889e8336a94291b98d31a47f9abc26',
            'priority': 1,
            'regex': '.* (HBLF).* (_.*)',
            'space_id': '31961438fbe0426a93512b48af77552a'
          },
          {
            'id': '9aa823c8ee2e4dee8c9c8e26240eb47c',
            'priority': 2,
            'regex': 'PIX_PISZ_(.*) ',
            'space_id': '31961438fbe0426a93512b48af77552a'
          }
        ],
        'snmp_community': 'cisco',
        'device_profile_list': [],
        'session_num': 2,
        'space_devices': [
          { 'ip': '10.124.209.162', 'hostname': 'SZ2', 'snmp_checkresult': true, 'netconf_checkresult': 'N / A' },
          { 'ip': '10.124.209.195', 'hostname': 'BR3', 'snmp_checkresult': true, 'netconf_checkresult': true },
          {
            'ip': '10.124.209.173',
            'hostname': 'PIX_PISZ_R_02_SZXL_106_06F_NE40E',
            'snmp_checkresult': true,
            'netconf_checkresult': 'N / A'
          },
          { 'ip': '10.124.209.196', 'hostname': 'R196.cisco.com', 'snmp_checkresult': true, 'netconf_checkresult': false },
          { 'ip': '10.124.209.171', 'hostname': 'SH1', 'snmp_checkresult': true, 'netconf_checkresult': 'N / A' },
          { 'ip': '10.124.209.191', 'hostname': 'BR1', 'snmp_checkresult': true, 'netconf_checkresult': true },
          { 'ip': '10.124.209.197', 'hostname': 'R117', 'snmp_checkresult': true, 'netconf_checkresult': 'N / A' },
          { 'ip': '10.124.209.167', 'hostname': 'SZ1', 'snmp_checkresult': true, 'netconf_checkresult': 'N / A' },
          { 'ip': '10.124.209.161', 'hostname': 'BJ2', 'snmp_checkresult': 'unchecked', 'netconf_checkresult': 'unchecked' },
          { 'ip': '10.124.209.193', 'hostname': 'BR2', 'snmp_checkresult': true, 'netconf_checkresult': true },
          { 'ip': '10.124.209.194', 'hostname': 'BR4', 'snmp_checkresult': true, 'netconf_checkresult': true },
          { 'ip': '10.124.209.163', 'hostname': 'SH2', 'snmp_checkresult': true, 'netconf_checkresult': 'N / A' }
        ],
        'device_num': 12
      }
    ]
  }
};
