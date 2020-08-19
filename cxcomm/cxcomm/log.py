# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

import os
import logging

DEBUG_LOG_FORMAT = '%(asctime)s.%(msecs)03d %(process)d %(levelname)s %(name)s ' \
                   '%(funcName)s %(lineno)d [-] %(message)s'
INFOR_LOG_FORMAT = '%(asctime)s.%(msecs)03d %(process)d %(levelname)s %(name)s [-] %(message)s'


def setup_log(log_file_name):
    """setup logging
    """
    logger = logging.getLogger()
    if os.environ.get('DEBUG'):
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)
    formatter = logging.Formatter(INFOR_LOG_FORMAT)
    handler = os.environ.get('HANDLER')
    if handler == 'file':
        filepath = os.environ.get('LOGFILE', './log')
        if not os.path.exists(filepath):
            os.makedirs(filepath)
        loghandler = logging.handlers.RotatingFileHandler(os.path.join(filepath, log_file_name))
        loghandler.setFormatter(formatter)
    else:
        loghandler = logging.StreamHandler()
        logger.setLevel(logging.DEBUG)
        loghandler.setFormatter(formatter)
    logger.addHandler(loghandler)
    return logger
