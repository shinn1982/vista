from webargs import fields
from marshmallow import validate

node = {
    'id': fields.Str(required=True),
    'ip': fields.Str(),
    'sid': fields.Int()
}

qos_class = {
    'class': fields.Str(),
    'bandwidth_reserve': fields.Int(missing=0),
    'bandwidth_available': fields.Int(missing=0),
    'traffic_flow': fields.Int(missing=0),
}

link = {
    'id': fields.Str(required=True),
    'lo': fields.Str(load_from='local', required=True),
    're': fields.Str(load_from='remote', required=True),
    'ip': fields.Str(),
    'sid': fields.Int(),
    'igp': fields.Int(missing=0),
    'te': fields.Int(missing=0),
    'bd': fields.Int(load_from='bandwidth', missing=-1),
    'affi': fields.Int(load_from='affinity', missing=0),
    'delay': fields.Float(load_from='delay', missing=1000),
    'min_delay': fields.Float(load_from='min_delay', missing=1000),
    'max_delay': fields.Float(load_from='max_delay', missing=1000),
    'qos_class': fields.List(fields.Nested(qos_class)),
    'traffic_flow': fields.Int(),
}

former = {
    'he': fields.Str(load_from='headend', required=True),
    'te': fields.Str(load_from='tailend', required=True),
    'metric': fields.Str(
        load_from='metric', missing='igp',
        validate=validate.OneOf(['igp', 'te', 'latency'])
    ),
    'bd': fields.Int(load_from='bandwidth', missing=0),
    'affi': fields.Str(load_from='affinity'),
    'mask': fields.Str(),
    'inc': fields.List(fields.Str(), load_from='include', missing=[]),
    'exc': fields.List(fields.Str(), load_from='exclude', missing=[]),
    'dis': fields.Bool(load_from='disjoint', missing=False),
    'class': fields.Str(load_from='class'),
    'priority': fields.Int(load_from='priority'),
    'segment_list': fields.Str(load_from='segment_list'),
    'path': fields.List(fields.List(fields.List(fields.Str()))),
    'debug': fields.Bool(missing=False),
}

policy = {
    'id': fields.Str(load_from='headend'),
    'former': fields.Nested(former),
    'he': fields.Str(load_from='headend', required=True),
    'te': fields.Str(load_from='tailend', required=True),
    'metric': fields.Str(
        load_from='metric', missing='igp',
        validate=validate.OneOf(['igp', 'te', 'latency'])
    ),
    'bd': fields.Int(load_from='bandwidth', missing=0),
    'affi': fields.Str(load_from='affinity'),
    'mask': fields.Str(),
    'inc': fields.List(fields.Str(), load_from='include', missing=[]),
    'exc': fields.List(fields.Str(), load_from='exclude', missing=[]),
    'dis': fields.Bool(load_from='disjoint', missing=False),
    'class': fields.Str(load_from='class'),
    'priority': fields.Int(load_from='priority'),
    'debug': fields.Bool(missing=False),
}

algorithm = {
    'algo': fields.Int(load_from='algo', missing=0),
    'sorter': fields.Str(
        load_from='sorter',
        validate=validate.OneOf(['metric', 'max_min_band', 'min_hop'])
    ),
    'top': fields.Int(),
    'limit': fields.Int(),
    'loose': fields.Bool(),
}

global_params = {
    'algorithm': fields.List(fields.Nested(algorithm)),
    'real_traffic': fields.Bool(load_from='real_traffic', missing=False),
    'traffic_ratio': fields.Float(load_from='traffic_ratio', missing=1.0),
    'flow_factor': fields.Float(load_from='flow_factor'),
}

pasta_policy = {
    'nodes': fields.List(fields.Nested(node), required=True),
    'links': fields.List(fields.Nested(link), required=True),
    'sr_policy': fields.Nested(policy),
    'global': fields.Nested(global_params),
}
