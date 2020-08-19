from webargs import fields
from marshmallow import validate

node = {
    'id': fields.Str(required=True),
    'ip': fields.Str(),
    'sid': fields.Int()
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
}

pasta = {
    'nodes': fields.List(fields.Nested(node), required=True),
    'links': fields.List(fields.Nested(link), required=True),
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
    'loose': fields.Bool(missing=False),
    'sorter': fields.Str(
        load_from='sorter', missing='metric',
        validate=validate.OneOf(['metric', 'max_min_band', 'min_hop'])
    ),
    'top': fields.Int(missing=10),
    'limit': fields.Int(missing=0),
    'debug': fields.Bool(missing=False),
}

simple = {
    'nodes': fields.List(fields.Nested(node), required=True),
    'links': fields.List(fields.Nested(link), required=True),
    'he': fields.Str(load_from='headend', required=True),
    'te': fields.Str(load_from='tailend', required=True)
}

path = {
    'nodes': fields.List(fields.Nested(node), required=True),
    'links': fields.List(fields.Nested(link), required=True),
    'sids': fields.List(fields.Str(), missing=[]),
    'sids_list': fields.List(fields.List(fields.Str()), missing=[])
}
