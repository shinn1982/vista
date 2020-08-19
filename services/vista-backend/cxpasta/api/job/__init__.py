# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

from cxcomm.rest.blue_print import blue_print
from cxpasta.api.job.job import AsyncJob

BLUE_PRINT = blue_print('job', 'templates', [
    [AsyncJob, '/job/check_status', '/job/check_status']
])
