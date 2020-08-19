export const MOCK_GET_TOPO = {
  'status': true,
  'info': {},
  'data': {
    '_id': '5f11be474241d354a338005f',
    'snapshot_name': 'topo1',
    'nodes': [
      {
        'id': 'P1',
        'ip': '1.1.1.1',
        'sid': 16001,
        'x_axis': 82,
        'y_axis': 393
      },
      {
        'id': 'P3',
        'ip': '3.3.3.3',
        'sid': 16003,
        'x_axis': 1053,
        'y_axis': 393
      },
      {
        'id': 'P5',
        'ip': '5.5.5.5',
        'sid': 16005,
        'x_axis': 338,
        'y_axis': 282
      },
      {
        'id': 'P6',
        'ip': '6.6.6.6',
        'sid': 16006,
        'x_axis': 804,
        'y_axis': 282
      },
      {
        'id': 'P7',
        'ip': '7.7.7.7',
        'sid': 16007,
        'x_axis': 563,
        'y_axis': 70.5
      },
      {
        'id': 'P8',
        'ip': '8.8.8.8',
        'sid': 16008,
        'x_axis': 338,
        'y_axis': 646
      },
      {
        'id': 'P9',
        'ip': '9.9.9.9',
        'sid': 16009,
        'x_axis': 804,
        'y_axis': 646
      },
      {
        'id': 'P10',
        'ip': '10.10.10.10',
        'sid': 16010,
        'x_axis': 556,
        'y_axis': 457
      }],
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
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
        'qos_class': [{
          'class': 'Gold',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }, {
          'class': 'Silver',
          'bandwidth_reserve': 500,
          'bandwidth_available': 500,
          'traffic_flow': 0
        }
        ]
      }],
    // 'nodes': [
    //   {
    //     'id': 'P1',
    //     'ip': '1.1.1.1',
    //     'sid': 60001,
    //     'x_axis': 179,
    //     'y_axis': 352
    //   },
    //   {
    //     'id': 'P2',
    //     'ip': '2.2.2.2',
    //     'sid': 60002,
    //     'x_axis': 650,
    //     'y_axis': 177
    //   },
    //   {
    //     'id': 'P3',
    //     'ip': '3.3.3.3',
    //     'sid': 60003,
    //     'x_axis': 1170,
    //     'y_axis': 507
    //   },
    //   {
    //     'id': 'P4',
    //     'ip': '4.4.4.4',
    //     'sid': 60004,
    //     'x_axis': 395,
    //     'y_axis': 492
    //   },
    //   {
    //     'id': 'P5',
    //     'ip': '5.5.5.5',
    //     'sid': 60005,
    //     'x_axis': 589,
    //     'y_axis': 664
    //   },
    //   {
    //     'id': 'P6',
    //     'ip': '6.6.6.6',
    //     'sid': 60006,
    //     'x_axis': 962,
    //     'y_axis': 235
    //   }
    // ],
    // 'links': [
    //   {
    //     'affinity': 0,
    //     'remote': 'P2',
    //     'sid': 30012,
    //     'local': 'P1',
    //     'bandwidth': 100,
    //     'ip': '1.1.1.2',
    //     'te': 10,
    //     'id': 'P1:30012',
    //     'delay': 100,
    //     'igp': 10,
    //     'qos_class': [
    //       {
    //         'class': 'Gold',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       },
    //       {
    //         'class': 'Silver',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       }
    //     ]
    //   },
    //   {
    //     'affinity': 0,
    //     'remote': 'P3',
    //     'sid': 30023,
    //     'local': 'P2',
    //     'bandwidth': 100,
    //     'ip': '2.2.2.3',
    //     'te': 10,
    //     'id': 'P2:30023',
    //     'delay': 100,
    //     'igp': 10,
    //     'qos_class': [
    //       {
    //         'class': 'Gold',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       },
    //       {
    //         'class': 'Silver',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       }
    //     ]
    //   },
    //   {
    //     'affinity': 0,
    //     'remote': 'P4',
    //     'sid': 30014,
    //     'local': 'P1',
    //     'bandwidth': 100,
    //     'ip': '1.1.1.4',
    //     'te': 10,
    //     'id': 'P1:30014',
    //     'delay': 100,
    //     'igp': 10,
    //     'qos_class': [
    //       {
    //         'class': 'Gold',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       },
    //       {
    //         'class': 'Silver',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       }
    //     ]
    //   },
    //   {
    //     'affinity': 0,
    //     'remote': 'P5',
    //     'sid': 30045,
    //     'local': 'P4',
    //     'bandwidth': 100,
    //     'ip': '4.4.4.5',
    //     'te': 10,
    //     'id': 'P4:30045',
    //     'delay': 100,
    //     'igp': 10,
    //     'qos_class': [
    //       {
    //         'class': 'Gold',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       },
    //       {
    //         'class': 'Silver',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       }
    //     ]
    //   },
    //   {
    //     'affinity': 0,
    //     'remote': 'P6',
    //     'sid': 30046,
    //     'local': 'P4',
    //     'bandwidth': 100,
    //     'ip': '4.4.4.6',
    //     'te': 10,
    //     'id': 'P4:30046',
    //     'delay': 100,
    //     'igp': 10,
    //     'qos_class': [
    //       {
    //         'class': 'Gold',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       },
    //       {
    //         'class': 'Silver',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       }
    //     ]
    //   },
    //   {
    //     'affinity': 0,
    //     'remote': 'P3',
    //     'sid': 30053,
    //     'local': 'P5',
    //     'bandwidth': 100,
    //     'ip': '5.5.5.3',
    //     'te': 10,
    //     'id': 'P5:30053',
    //     'delay': 100,
    //     'igp': 10,
    //     'qos_class': [
    //       {
    //         'class': 'Gold',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       },
    //       {
    //         'class': 'Silver',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       }
    //     ]
    //   },
    //   {
    //     'affinity': 0,
    //     'remote': 'P3',
    //     'sid': 30063,
    //     'local': 'P6',
    //     'bandwidth': 100,
    //     'ip': '6.6.6.3',
    //     'te': 10,
    //     'id': 'P6:30063',
    //     'delay': 100,
    //     'igp': 10,
    //     'qos_class': [
    //       {
    //         'class': 'Gold',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       },
    //       {
    //         'class': 'Silver',
    //         'bandwidth_reserve': 50,
    //         'bandwidth_available': 50,
    //         'traffic_flow': 0
    //       }
    //     ]
    //   }
    // ]
  }
};
