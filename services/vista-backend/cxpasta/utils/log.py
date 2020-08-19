# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

import os
import logging
import logging.handlers

DEBUG_LOG_FORMAT = '%(threadName)s %(thread)s %(asctime)s.%(msecs)03d %(process)d %(levelname)s %(name)s ' \
                   '%(funcName)s %(lineno)d [-] %(message)s'
INFOR_LOG_FORMAT = '%(threadName)s %(thread)s %(asctime)s.%(msecs)03d %(process)d %(levelname)s %(name)s ' \
                   '%(lineno)d [-] %(message)s'


def setup_log(log_level, log_handler, log_dir, log_file_name, backupCount=1):
    """setup logging
    """
    logger = logging.getLogger()
    if log_level == 'DEBUG':
        logger.setLevel(logging.DEBUG)
        formatter = logging.Formatter(DEBUG_LOG_FORMAT)
    else:
        logger.setLevel(logging.INFO)
        formatter = logging.Formatter(INFOR_LOG_FORMAT)
    # handler = os.environ.get('HANDLER')
    if log_handler == 'file':
        # filepath = os.environ.get('LOGFILE', './log')
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
        loghandler = logging.handlers.RotatingFileHandler(
            filename=os.path.join(log_dir, log_file_name), maxBytes=100000000, backupCount=backupCount)
        loghandler.setFormatter(formatter)
    else:
        loghandler = logging.StreamHandler()
        loghandler.setFormatter(formatter)
    logger.addHandler(loghandler)
    return logger
