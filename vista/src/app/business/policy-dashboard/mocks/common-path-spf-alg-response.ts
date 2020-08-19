export const COMMON_PATH_SPF_ALG_RES = {
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
            'id': 'P6',
            'ip': '6.6.6.6',
            'sid': 16006
          },
          {
            'id': 'P6-30003',
            'lo': 'P6',
            're': 'P3',
            'igp': 10,
            'te': 10,
            'delay': 1000.0,
            'bd': 500,
            'affi': 0,
            'ip': '6.6.6.3',
            'sid': 30003
          },
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
          ]
        ],
        'segs': [
          [
            [
              'P1',
              'P1-30001',
              'P5',
              'P5-30002',
              'P6'
            ]
          ],
          [
            [
              'P6',
              'P6-30003',
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
        'time': 0.39
      }
    }
  ]
};
