export const SR_PATH_AUTO_ALG_RES = {
  'status': true,
  'info': {},
  'data': [
    {
      'algo_type': 0,
      'status': true,
      'info': {},
      'data': {
        'sids': [
          {
            'id': 'P3',
            'ip': '3.3.3.3',
            'sid': 16003
          }
        ],
        'paths': [
          [
            'P1',
            'P1-30001',
            'P5',
            'P5-30002',
            'P6',
            'P6-30003',
            'P3'
          ],
          [
            'P1',
            'P1-30004',
            'P8',
            'P8-30005',
            'P9',
            'P9-30006',
            'P3'
          ]
        ],
        'segs': [
          [
            [
              'P1',
              'P1-30001',
              'P5',
              'P5-30002',
              'P6',
              'P6-30003',
              'P3'
            ],
            [
              'P1',
              'P1-30004',
              'P8',
              'P8-30005',
              'P9',
              'P9-30006',
              'P3'
            ]
          ]
        ],
        'attr': {
          'igp': 30,
          'te': 30,
          'delay': 3000.0,
          'min_hop': 3,
          'max_min_band': 500
        },
        'other': [],
        'time': 0.3
      }
    }
  ]
};
