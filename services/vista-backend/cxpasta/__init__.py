# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

import os
import yaml
from flask import Flask
from flask_pymongo import PyMongo

from cxpasta.api import BLUEPRINTS
from cxpasta.utils.log import setup_log


def create_app(config_name=None):
    """
    create flask application
    """
    config_file = os.getenv('config_file', 'vista_backend_local.yaml')
    # print(os.path.join(os.getcwd(), 'etc/%s' % config_file))
    sys_config = yaml.load(open(os.path.join(os.getcwd(), 'etc/%s' % config_file)))
    setup_log(log_level=sys_config['log']['level'], log_handler=sys_config['log']['handler'],
              log_dir=sys_config['log']['file_dir'], log_file_name=sys_config['log']['file_name'])
    mongo_url = sys_config['mongo_url']
    # print(mongo_url)

    # setup_log('pasta.log')
    app = Flask(__name__)
    app.config['DEBUG'] = True
    app.mongo = PyMongo(app, uri=mongo_url)

    for blueprint in BLUEPRINTS:
        url_prefix = '/' if blueprint[1] == 'BLUE_PRINT_PUBLIC' else '/api'
        app.register_blueprint(blueprint[0], url_prefix=url_prefix)
    return app
