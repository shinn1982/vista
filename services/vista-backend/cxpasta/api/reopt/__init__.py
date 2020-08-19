# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

from cxcomm.rest.blue_print import blue_print
from cxpasta.api.reopt.reopt import NonbodReoptimize, BodReoptimize, AsyncBodReoptimize, AsyncNonbodReoptimize

BLUE_PRINT = blue_print('reopt', 'templates', [
    [AsyncNonbodReoptimize, '/reopt/async_nonbod_reoptimize', '/reopt/async_nonbod_reoptimize'],
    [AsyncBodReoptimize, '/reopt/async_bod_reoptimize', '/reopt/async_bod_reoptimize'],
    [NonbodReoptimize, '/reopt/pasta_reoptimize', '/reopt/nonbod_reoptimize'],
    [BodReoptimize, '/reopt/bod_reoptimize', '/reopt/bod_reoptimize']
])
