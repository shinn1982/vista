export const COMMON_PATH_NONSPF_ALG_REQUEST = {
  'nodes': [
    {
      'id': 'P1',
      'ip': '1.1.1.1',
      'sid': 16001
    },
    {
      'id': 'P3',
      'ip': '3.3.3.3',
      'sid': 16003
    },
    {
      'id': 'P5',
      'ip': '5.5.5.5',
      'sid': 16005
    },
    {
      'id': 'P6',
      'ip': '6.6.6.6',
      'sid': 16006
    },
    {
      'id': 'P7',
      'ip': '7.7.7.7',
      'sid': 16007
    },
    {
      'id': 'P8',
      'ip': '8.8.8.8',
      'sid': 16008
    },
    {
      'id': 'P9',
      'ip': '9.9.9.9',
      'sid': 16009
    },
    {
      'id': 'P10',
      'ip': '10.10.10.10',
      'sid': 16010
    }
  ],
  'links': [
    {
      'id': 'P1-30001',
      'local': 'P1',
      'remote': 'P5',
      'ip': '1.1.1.5',
      'sid': 30001,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    },
    {
      'id': 'P5-30002',
      'local': 'P5',
      'remote': 'P6',
      'ip': '5.5.5.6',
      'sid': 30002,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    },
    {
      'id': 'P6-30003',
      'local': 'P6',
      'remote': 'P3',
      'ip': '6.6.6.3',
      'sid': 30003,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    },
    {
      'id': 'P1-30004',
      'local': 'P1',
      'remote': 'P8',
      'ip': '1.1.1.8',
      'sid': 30004,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    },
    {
      'id': 'P8-30005',
      'local': 'P8',
      'remote': 'P9',
      'ip': '8.8.8.9',
      'sid': 30005,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    },
    {
      'id': 'P9-30006',
      'local': 'P9',
      'remote': 'P3',
      'ip': '9.9.9.3',
      'sid': 30006,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    },
    {
      'id': 'P5-30007',
      'local': 'P5',
      'remote': 'P7',
      'ip': '5.5.5.7',
      'sid': 30007,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    },
    {
      'id': 'P7-30008',
      'local': 'P7',
      'remote': 'P6',
      'ip': '7.7.7.6',
      'sid': 30008,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    },
    {
      'id': 'P8-30009',
      'local': 'P8',
      'remote': 'P10',
      'ip': '8.8.8.10',
      'sid': 30009,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    },
    {
      'id': 'P10-30010',
      'local': 'P10',
      'remote': 'P9',
      'ip': '10.10.10.9',
      'sid': 30010,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    },
    {
      'id': 'P5-30029',
      'local': 'P5',
      'remote': 'P8',
      'ip': '5.5.5.8',
      'sid': 30029,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    },
    {
      'id': 'P7-30031',
      'local': 'P7',
      'remote': 'P10',
      'ip': '7.7.7.10',
      'sid': 30031,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    },
    {
      'id': 'P6-30033',
      'local': 'P6',
      'remote': 'P9',
      'ip': '6.6.6.9',
      'sid': 30033,
      'igp': 10,
      'te': 10,
      'delay': 1000,
      'bandwidth': 1000,
      'affinity': 0,
      'qos_class': [
        {
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        },
        {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
      ]
    }
  ],
  'sr_policy': {
    'id': 'SR1',
    'headend': 'P1',
    'tailend': 'P3',
    'metric': 'igp',
    'bandwidth': 100,
    'include': [],
    'exclude': [],
    'tiebreaker': false,
    'disjoint': false,
    'reopt_enable': true,
    'class': 'Gold',
    'priority': 2
  },
  'global': {
    'algorithm': [
      {
        'algo': 1,
        'sorter': 'metric',
        'top': 2,
        'limit': 0,
        'loose': true
      }
    ],
    'flow_factor': 1.0,
    'real_traffic': false,
    'traffic_ratio': 1.0
  }
};
