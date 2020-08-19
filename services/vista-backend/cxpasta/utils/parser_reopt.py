from webargs import fields
from marshmallow import validate

node_prefix = {
    'prefix': fields.Str(),
    'prefix_algorithm': fields.Int(),
    'prefix_sid': fields.Int(),
}

node = {
    'id': fields.Str(required=True),
    'prefix': fields.List(fields.Nested(node_prefix)),
    'ip': fields.Str(),
    'sid': fields.Int()
}

qos_class = {
    'class': fields.Str(),
    'bandwidth_reserve': fields.Float(missing=0),
    'bandwidth_available': fields.Float(missing=0),
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

policy = {
    'id': fields.Str(load_from='id', required=True),
    'he': fields.Str(load_from='headend', required=True),
    'te': fields.Str(load_from='tailend', required=True),
    'metric': fields.Str(
        load_from='metric', missing='igp',
        validate=validate.OneOf(['igp', 'te', 'latency'])
    ),
    'algorithm': fields.Int(load_from='algorithm'),
    'bd': fields.Int(load_from='bandwidth', missing=0),
    'affi': fields.Str(load_from='affinity'),
    'mask': fields.Str(),
    'inc': fields.List(fields.Str(), load_from='include', missing=[]),
    'exc': fields.List(fields.Str(), load_from='exclude', missing=[]),
    'dis': fields.Bool(load_from='disjoint', missing=False),
    'segment_list': fields.Str(load_from='segment_list'),
    'class': fields.Str(load_from='class'),
    'priority': fields.Int(load_from='priority'),
    'path': fields.List(fields.List(fields.List(fields.Str()))),
    'traffic_flow': fields.Int(),
    'debug': fields.Bool(missing=False),
}

algorithm = {
    'algo': fields.Int(load_from='algo'),
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
    'sorting': fields.Str(
        load_from='sorter',
        validate=validate.OneOf(['bandwidth_desc', 'bandwidth_asc', 'priority_desc', 'priority_asc'])
    ),
    'reopt_mode': fields.Str(
        load_from='reopt_mode',
        validate=validate.OneOf(['loose', 'strict'])
    ),
    'congest_threshold': fields.Float(load_from='congest_threshold'),
    'target_threshold': fields.Float(load_from='target_threshold'),
    'prioriry_prefer': fields.Str(
        load_from='prioriry_prefer',
        validate=validate.OneOf(['HIGH', 'LOW'])
    ),
    'traffic_prefer': fields.Str(
        load_from='traffic_prefer',
        validate=validate.OneOf(['HIGH', 'LOW'])
    ),
    'priority_weight': fields.Float(load_from='priority_weight'),
    'bandwidth_weight': fields.Float(load_from='bandwidth_weight'),
}

pasta_reopt = {
    'nodes': fields.List(fields.Nested(node), required=True),
    'links': fields.List(fields.Nested(link), required=True),
    'congested_link': fields.List(fields.Str(), load_from='congested_link'),
    'sr_policy': fields.List(fields.Nested(policy)),
    'global': fields.Nested(global_params),
}
