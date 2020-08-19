# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.


from flask import Blueprint
from flask_restful import Api


def blue_print(blue_print_name, template_folder, resources):
    '''
    blue print
    '''
    bpt = Blueprint(blue_print_name, __name__, template_folder=template_folder)

    api = Api(bpt)

    for res in resources:
        if isinstance(res, list):
            api.add_resource(*res)
        else:
            api.add_resource(*res['args'], **res['kwargs'])

    return bpt
