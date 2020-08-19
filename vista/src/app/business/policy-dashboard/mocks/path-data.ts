export const MOCK_GET_PATH = {
  'status': true,
  'error': false,
  'info': {},
  'data': {
    'data_list': [
      {
        '_id': '1d354a338005f11be7b42460',
        'snapshot_name': 'topo1',
        'id': 'P1_to_P9',
        'headend': 'P1',
        'tailend': 'P9',
        'metric': 'te',
        'bandwidth': 100,
        'affinity': '0x0',
        'mask': '0x0',
        'include': [],
        'exclude': [],
        'tiebreaker': false,
        'disjoint': false,
        'class': 'Silver',
        'priority': 1,
        'segment_list': '16009',
        'path': [
          [
            'P1',
            'P1-30004',
            'P8',
            'P8-30005',
            'P9'
          ]
        ],
        'segments': [
          [
            [
              'P1',
              'P1-30004',
              'P8',
              'P8-30005',
              'P9'
            ]
          ]
        ],
        'algorithm': {
          'algo': 0,
          'sorter': 'metric',
          'top': 10,
          'limit': 0,
          'loose': false
        }
      },
      {
        '_id': 'be7b424601d354a338005f11',
        'snapshot_name': 'topo1',
        'id': 'P5_to_P9',
        'headend': 'P5',
        'tailend': 'P9',
        'metric': 'igp',
        'bandwidth': 300,
        'affinity': '0x0',
        'mask': '0x0',
        'include': [
          'P7',
          'P10'
        ],
        'exclude': [],
        'tiebreaker': false,
        'disjoint': false,
        'class': 'Gold',
        'priority': 0,
        'segment_list': '16007 30031 16009',
        'path': [
          [
            'P5',
            'P5-30007',
            'P7',
            'P7-30031',
            'P10',
            'P10-30010',
            'P9'
          ]
        ],
        'segments': [
          [
            [
              'P5',
              'P5-30007',
              'P7'
            ]
          ],
          [
            [
              'P7',
              'P7-30031',
              'P10'
            ]
          ],
          [
            [
              'P10',
              'P10-30010',
              'P9'
            ]
          ]
        ],
        'algorithm': {
          'algo': 0,
          'sorter': 'metric',
          'top': 10,
          'limit': 0,
          'loose': false
        }
      },
      {
        '_id': '338001d3511be7b424604a5f',
        'snapshot_name': 'topo1',
        'id': 'P8_to_P3',
        'headend': 'P8',
        'tailend': 'P3',
        'metric': 'igp',
        'bandwidth': 150,
        'affinity': '0x0',
        'mask': '0x0',
        'include': [],
        'exclude': [],
        'tiebreaker': false,
        'disjoint': false,
        'class': 'Silver',
        'priority': 1,
        'segment_list': '16003',
        'path': [
          [
            'P8',
            'P8-30005',
            'P9',
            'P9-30006',
            'P3'
          ]
        ],
        'segments': [
          [
            [
              'P8',
              'P8-30005',
              'P9',
              'P9-30006',
              'P3'
            ]
          ]
        ],
        'algorithm': {
          'algo': 0,
          'sorter': 'metric',
          'top': 10,
          'limit': 0,
          'loose': false
        }
      }
    ],
    'current_page': 1,
    'num_of_all': 8,
    'total_page': 1,
  }
};
