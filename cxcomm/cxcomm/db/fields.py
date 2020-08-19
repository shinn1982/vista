# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.

import abc
import uuid

import netaddr

from werkzeug.security import generate_password_hash
from cxcomm.i18n import _


class AbstractFieldType(object):
    """abstract field type class
    """
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def constraint(self, obj, attr, value):
        '''this method is called to convert the given value into the designated type,
        or throw an exception if this is not possible.
        :param:obj: The NetseenDbObject on which an attribute is being set
        :param:attr: The name of the attribute being set
        :param:value: The value being set
        :returns: A properly-typed value
        '''
        pass


class Field(object):
    """base field class
    """

    def __init__(self, field_type, nullable=False):
        self._type = field_type
        self._nullable = nullable

    @property
    def nullable(self):
        """property for if this field is nullable
        """
        return self._nullable

    def _null(self, obj, attr):
        """process field value is None
        """
        if self.nullable:
            return None
        else:
            raise ValueError(
                _("field '%(attr)s' of object '%(obj)s' cannot be None.") %
                {'attr': attr, 'obj': obj}
            )

    def constraint(self, obj, attr, value):
        """make sure field value is valid
        """
        if value is None:
            return self._null(obj, attr)
        else:
            return self._type.constraint(obj, attr, value)


class String(AbstractFieldType):
    """string format filed type
    """
    @staticmethod
    def constraint(obj, attr, value):
        """make sure the field value is string or converted to string
        """
        accepted_types = (str, int)

        if isinstance(value, accepted_types):
            return str(value)
        else:
            raise ValueError(
                _("a string is required in field %(attr)s, not a %(type)s.") %
                {'attr': attr, 'type': type(value).__name__}
            )


class Integer(AbstractFieldType):
    """interger format field type
    """
    @staticmethod
    def constraint(obj, attr, value):
        return int(value)


class Float(AbstractFieldType):
    """float format
    """
    @staticmethod
    def constraint(obj, attr, value):
        return float(value)


class Boolean(AbstractFieldType):
    """bool format field type
    """
    @staticmethod
    def constraint(obj, attr, value):
        return bool(value)


class IPAddress(AbstractFieldType):
    """ip address field type
    """
    @staticmethod
    def constraint(obj, attr, value):
        try:
            return netaddr.IPAddress(value).__str__()
        except netaddr.AddrFormatError:
            raise ValueError(
                _("%(val)s is not valid IP Address for the field %(attr)s") % {'val': value, 'attr': attr})


class IPNetwork(AbstractFieldType):
    """IP Network field type
    """
    @staticmethod
    def constraint(obj, attr, value):
        try:
            return netaddr.IPNetwork(value).__str__()
        except netaddr.AddrFormatError as e:
            raise ValueError(str(e))


class UUID(AbstractFieldType):
    """UUID filed type
    """
    @staticmethod
    def constraint(obj, attr, value):
        try:
            if not value:
                return uuid.uuid4().hex
            return uuid.UUID(str(value)).hex
        except Exception:
            raise ValueError(
                _("a UUID is required in field %(attr)s.") %
                {'attr': attr}
            )


class PassWord(AbstractFieldType):
    """PassWord filed type
    """
    @staticmethod
    def constraint(obj, attr, value):
        try:
            return generate_password_hash(value)
        except Exception:
            raise ValueError(
                _("a password is required in field %(attr)s.") %
                {'attr': attr}
            )


class IPV4Address(IPAddress):
    """ipv4 address field type
    """
    @staticmethod
    def constraint(obj, attr, value):
        result = IPAddress.constraint(obj, attr, value)
        if result.version != 4:
            raise ValueError(
                _("%(val)s is not valid for the field %(attr)s") % {'val': value, 'attr': attr})
        return result


class AutoTypedField(Field):
    AUTO_TYPE = None

    def __init__(self, **kwargs):
        try:
            super().__init__(self.AUTO_TYPE, **kwargs)
        except TypeError:
            super(AutoTypedField, self).__init__(self.AUTO_TYPE, **kwargs)


class StringField(AutoTypedField):
    AUTO_TYPE = String()


class IntegerField(AutoTypedField):
    AUTO_TYPE = Integer()


class FloatField(AutoTypedField):
    AUTO_TYPE = Float()


class BooleanField(AutoTypedField):
    AUTO_TYPE = Boolean()


class IPAddressField(AutoTypedField):
    AUTO_TYPE = IPAddress()


class IPNetworkField(AutoTypedField):
    AUTO_TYPE = IPNetwork()


class UUIDField(AutoTypedField):
    AUTO_TYPE = UUID()


class PassWordField(AutoTypedField):
    AUTO_TYPE = PassWord()
