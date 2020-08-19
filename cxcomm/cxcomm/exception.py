# Copyright 2015-2018 Cisco Systems, Inc.
# All rights reserved.


from cxcomm.i18n import _


class BaseException(Exception):
    '''
    customize exception
    '''
    message = 'An unknown exception occurred'

    def __init__(self, **kwargs):
        try:
            try:
                super().__init__(self.message % kwargs)
            except TypeError:
                super(BaseException, self).__init__(self.message % kwargs)
            self.msg = self.message % kwargs
        except Exception:
            # at least get the core message out if something happened
            try:
                super().__init__(self.message)
            except TypeError:
                super(BaseException, self).__init__(self.message)

    def log(self):
        '''
        log except msg
        '''
        pass


class NotFound(BaseException):
    """A generic not found exception."""
    pass


class BadRequest(BaseException):
    """An exception indicating a generic bad request for a said resource.
    A generic exception indicating a bad request for a specified resource.
    """
    message = _('Bad %(resource)s request: %(msg)s.')


class ObjectFieldInvalid(BaseException):
    """the field value of object is invalid
    """
    message = _("Field %(field)s of %(objname)s is not an instance of Field")


class ObjectFieldUpdateError(BaseException):
    """the field value of object do not allow to update
    """
    message = _("Field %(field)s of %(objname)s no update allowed")


class Conflict(BaseException):
    """A generic conflict exception."""
    pass


class NotAuthorized(BaseException):
    """A generic not authorized exception."""
    message = _("Not authorized.")


class ServiceUnavailable(BaseException):
    """A generic service unavailable exception."""
    message = _("The service is unavailable.")


class ObjectNotFound(NotFound):
    """A not found exception indicating an identifiable object isn't found.
    A specialization of the NotFound exception indicating an object with a said
    ID doesn't exist.
    :param id: The ID of the (not found) object.
    """
    message = _("%(objtype)s object %(id)s not found.")


class NoAccessAuthority(BaseException):
    """No authority to do some operation"""
    message = _("current user no access to do %(obj_type)s %(oper_type)s operation.")


class StatusError(BaseException):
    """Target object status error."""
    message = _("%(obj_type)s object of %(status)s status can't do the %(action)s operation.")


class AssociationError(BaseException):
    """operation failed for association exitsting."""
    message = _("operation error because target %(obj)s object still has associations with %(ass_obj)s.")


class SqlExecuteError(BaseException):
    """Database operation error."""
    message = _("database general function execution error, %(info)s.")
