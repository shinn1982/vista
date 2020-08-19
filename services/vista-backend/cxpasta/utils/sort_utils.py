from cxpasta.constants import Bandwidth_KEY, Priority_KEY


class BaseSortWrapper():
    def __init__(self, sort_key):
        # sort_key type : bandwidth / priority
        self.sort_key = sort_key

    def cmp_mtd(self, x, y):
        pass


class CMP_ON_BW(BaseSortWrapper):

    def __init__(self, sort_key):
        super(CMP_ON_BW, self).__init__(sort_key)

    def cmp_mtd(self, x, y):
        if x[self.sort_key] > y[self.sort_key]:
            return 1
        elif x[self.sort_key] < y[self.sort_key]:
            return -1
        else:
            return 0


class CMP_ON_PRY(BaseSortWrapper):

    def __init__(self, sort_key):
        super(CMP_ON_PRY, self).__init__(sort_key)

    def cmp_mtd(self, x, y):
        if x[self.sort_key] > y[self.sort_key]:
            return 1
        elif x[self.sort_key] < y[self.sort_key]:
            return -1
        else:
            return 0


class SortFactory(object):

    @staticmethod
    def get_method(sort_type):

        if 'asc' in sort_type:
            reverse_type = False
        elif 'desc' in sort_type:
            reverse_type = True
        else:
            reverse_type = False

        if 'bandwidth' in sort_type:
            return CMP_ON_BW(Bandwidth_KEY), reverse_type
        elif 'priority' in sort_type:
            return CMP_ON_PRY(Priority_KEY), reverse_type
        else:
            return CMP_ON_BW(Bandwidth_KEY), reverse_type
