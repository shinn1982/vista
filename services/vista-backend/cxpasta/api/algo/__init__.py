# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

from cxcomm.rest.blue_print import blue_print
from cxpasta.api.algo.algo import SimpleResource, PathResource, PastaResource, NonBodPASTA, BodSRPolicy, \
    AsyncNonBodPASTA, AsyncBodSRPolicy

BLUE_PRINT = blue_print('pasta', 'templates', [
    [PastaResource, '/pasta', "/pasta"],
    [SimpleResource, '/pasta/simple', "/pasta/simple"],
    [PathResource, '/pasta/path', "/pasta/path"],

    # 用新PASTA接口(bod, non_bod)替换原有的接口
    [AsyncNonBodPASTA, '/pasta/async_non_pasta', '/pasta/async_nonbod_pasta'],
    [AsyncBodSRPolicy, '/pasta/async_bod_pasta', '/pasta/async_bod_pasta'],
    [NonBodPASTA, '/pasta/nonbod_pasta', '/pasta/nonbod_pasta'],
    [BodSRPolicy, '/pasta/bod_pasta', '/pasta/bod_pasta'],
])
