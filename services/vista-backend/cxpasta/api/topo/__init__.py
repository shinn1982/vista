# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

from cxcomm.rest.blue_print import blue_print
from cxpasta.api.topo.snapshot import Topology, Policy, GlobalParmas, Snapshot, SnapshotUtils

BLUE_PRINT = blue_print('topo', 'templates', [
    [Topology, '/snapshot/topo', '/snapshot/topo'],
    [Policy, '/snapshot/policy', '/snapshot/policy'],
    [GlobalParmas, '/snapshot/params', '/snapshot/params'],
    [Snapshot, '/snapshot', '/snapshot'],
    [SnapshotUtils, '/snapshot/utils', 'snapshot/utils']
])
