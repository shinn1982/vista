from heapq import heappush, heappop, heapify
from cxpasta.utils.decorators import timer


class Topology(object):

    def __init__(self, **kwargs):
        self.non_sr = set()
        self.nodes = self.make_nodes(kwargs.get('nodes', []))
        self.links = self.make_links(kwargs.get('links', []))
        self.topo = self.make_topo(self.links)

    def make_nodes(self, nodes):
        """Turn node list into a hash table.
        If it's a non-sr node, add it to self.non_sr
        """
        data = {}
        for node in nodes:
            id = node['id']
            data[id] = {}
            if 'ip' in node:
                data[id]['ip'] = node['ip']
            if 'sid' in node:
                data[id]['sid'] = node['sid']
            else:
                self.non_sr.add(id)
        return data

    def make_links(self, links):
        """Turn link list into a hash table.
        If it's a non-sr link, add it to self.non_sr
        """
        data = {}
        for link in links:
            id = link['id']
            data[id] = {
                'lo': link['lo'],
                're': link['re'],
                'igp': link['igp'],
                'te': link['te'],
                'delay': link['delay'],
                'bd': link['bd'],
                'affi': link['affi']
            }
            if 'ip' in link:
                data[id]['ip'] = link['ip']
            if 'sid' in link:
                data[id]['sid'] = link['sid']
            else:
                self.non_sr.add(id)
        return data

    def make_topo(self, links):
        """Turn link list into a hash table that represents the topology.
        """
        data = {}
        for k, v in links.items():
            if v['lo'] not in data:
                data[v['lo']] = {}
            data[v['lo']][k] = {
                're': v['re'],
                'igp': v['igp'],
                'te': v['te'],
                'delay': v['delay']
            }
        return data


class SPF(object):

    def __init__(self, topo, src, dest, metric='igp', loose=False, top=10):
        self.topo = topo
        self.src = src
        self.dest = dest
        self.metric = metric
        self.loose = loose
        self.top = top

    def spf(self):
        """Return standard SPF.
        """
        entry = [0, self.src, [self.src]]
        sofar = {self.src: entry}
        heap = [entry]
        final = {}

        while sofar:
            (cost, node, prev) = heappop(heap)
            final[node] = sofar[node]
            del sofar[node]
            if node == self.dest:
                return final[node][2]
            if node in self.topo:
                for k, v in self.topo[node].items():
                    nei = v['re']
                    if nei not in final:
                        new_cost = cost + v[self.metric]
                        new_prev = [f'{p} {k} {nei}' for p in prev]
                        new_entry = [new_cost, nei, new_prev]
                        if nei not in sofar:
                            sofar[nei] = new_entry
                            heappush(heap, new_entry)
                        elif new_cost < sofar[nei][0]:
                            sofar[nei][0] = new_cost
                            sofar[nei][1] = nei
                            sofar[nei][2] = new_prev
                            heapify(heap)
                        elif new_cost == sofar[nei][0]:
                            sofar[nei][2] += new_prev
        return []

    def non_spf(self):
        """Return all the paths that are reachable between two nodes.
        """
        entry = [0, self.src, [self.src]]
        sofar = {self.src: entry}
        heap = [entry]
        final = {}

        while sofar:
            (cost, node, prev) = heappop(heap)
            if node in final:
                final[node][2] += prev
            else:
                final[node] = sofar[node]
            del sofar[node]
            if node == self.dest and len(final[node][2]) >= self.top:
                break
            if node in self.topo:
                for k, v in self.topo[node].items():
                    nei = v['re']
                    new_cost = cost + v[self.metric]
                    loop_prev = [f'{p} {k} {nei}' for p in prev]
                    new_prev = loop_prev[:]
                    if nei in final:
                        for f in final[nei][2]:
                            for p in loop_prev:
                                if f in p:
                                    new_prev.remove(p)
                    if new_prev:
                        new_entry = [new_cost, nei, new_prev]
                        if nei not in sofar:
                            sofar[nei] = new_entry
                            heappush(heap, new_entry)
                        elif new_cost < sofar[nei][0]:
                            sofar[nei][0] = new_cost
                            sofar[nei][1] = nei
                            sofar[nei][2] += new_prev
                            heapify(heap)
                        elif new_cost >= sofar[nei][0]:
                            sofar[nei][2] += new_prev
        if self.dest in final:
            return final[self.dest][2]
        else:
            return []

    def run(self):
        """Client-easy builder method.
        Turn path string into list of hops.
        """
        if self.loose:
            return [path.split() for path in self.non_spf()]
        return [path.split() for path in self.spf()]


class Simple(Topology):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.he = self.make_filter(kwargs.get('he', None))
        self.te = self.make_filter(kwargs.get('te', None))

    def make_filter(self, element):
        if element in self.nodes:
            return element
        elif element in self.links:
            return element
        else:
            raise Exception(f'{element} does not exist.')

    @timer
    def run(self):
        return {
            'paths': SPF(self.topo, self.he, self.te).run()
        }


class Pasta(Simple):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.metric = kwargs.get('metric', 'igp')
        if self.metric == 'latency':
            self.metric = 'delay'
        self.inc = [self.make_filter(item) for item in kwargs.get('inc', [])]
        self.man_exc = {self.make_filter(item) for item in kwargs.get('exc', [])}
        self.bd = kwargs.get('bd', 0)
        self.affi = kwargs.get('affi', 0)
        self.mask = kwargs.get('mask', 0)
        self.sorter = kwargs.get('sorter', 'metric')
        self.top = kwargs.get('top', 10)
        self.limit = kwargs.get('limit', 0)
        self.loose = kwargs.get('loose', False)
        self.dis = kwargs.get('dis', False)
        self.exclude()

    def on_demand_bandwidth(self):
        """Exclude links that are not with enough bandwidth.
        """
        for k, v in self.links.items():
            bd = v.get('bd', -1)
            if bd != -1 and bd < self.bd:
                self.exc.add(k)

    def affinity_and_mask(self):
        """Exclude links that are not fullfill affinity & mask.
        affi: 0000 0001
        mask: 0000 0011
        affi & mask  = 0000 0001
        ~affi & mask = 0000 0010
        link1: 0000 0001 ok
        link2: 0000 0010 invalid
        link3: 0000 0011 invalid
        """
        try:
            affi = int(self.affi, 16)
            mask = int(self.mask, 16)
        except:
            raise Exception('Invalid affinity and mask value.')

        inc = affi & mask
        exc = ~affi & mask
        for k, v in self.links.items():
            link_affi = v['affi']
            if link_affi & inc != inc:
                self.exc.add(k)
            if link_affi & exc != 0:
                self.exc.add(k)

    def exclude(self):
        """Add all kinds of exludes together.
        """
        self.exc = self.man_exc.union(self.non_sr)
        if self.bd:
            self.on_demand_bandwidth()
        if self.affi and self.mask:
            self.affinity_and_mask()

    def remake_topo(self, exc):
        """Re-generate topology after exclude certain nodes and links.
        """
        return self.make_topo({
            k: v for k, v in self.links.items()
            if k not in exc and v['lo'] not in exc and v['re'] not in exc
        })

    def revert(self, sids, simple=False):
        """Turn a list of sids into segs of paths.
        """
        metric, loose = ('igp', False) if simple else (self.metric, self.loose)
        src, sids = sids[0], sids[1:]
        if src in self.links:
            src = self.links[src]['re']
        segs = []
        for sid in sids:
            if sid == src:
                continue
            if sid in self.links:
                lo = self.links[sid]['lo']
                re = self.links[sid]['re']
                if sid == lo:
                    paths = [[lo, sid, re]]
                else:
                    paths = SPF(self.topo, src, lo, metric, loose, self.top).run()
                    paths = [path + [sid, re] for path in paths]
                src = re
            else:
                paths = SPF(self.topo, src, sid, metric, loose, self.top).run()
                src = sid
            segs.append(paths)
        return segs

    def rsv(self, paths, exc):
        """Return paths and actually path-effected excludes after excluded.
        """
        if not exc:
            return paths, exc
        rsv_exc = set()
        rsv_paths = paths[:]
        for path in paths:
            for e in exc:
                if e in path:
                    rsv_exc.add(e)
                    if path in rsv_paths:
                        rsv_paths.remove(path)
        return rsv_paths, rsv_exc

    def detail(self, path):
        """Supplement each path with certain details.
        """
        links = path[1::2]
        hop = len(links)
        first_hop, links = self.links[links[0]], links[1:]
        igp, te, delay, bd = [first_hop[k] for k in ['igp', 'te', 'delay', 'bd']]
        for link in links:
            link = self.links[link]
            igp += link['igp']
            te += link['te']
            delay += link['delay']
            bd = min(bd, link['bd'])
        return {
            'path': path,
            'igp': igp,
            'te': te,
            'delay': delay,
            'min_hop': hop,
            'max_min_band': bd
        }

    def tiebreaker(self, paths, top=None, limit=None):
        """Return TOP sorted paths with certain order and limit.
        """
        paths = [self.detail(path) for path in paths]
        sorter = self.metric if self.sorter == 'metric' else self.sorter
        if limit:
            if self.sorter == 'max_min_band':
                paths = [path for path in paths if path[sorter] >= self.limit]
            else:
                paths = [path for path in paths if path[sorter] <= self.limit]
        paths = sorted(paths, key=lambda c: c[sorter], reverse=self.sorter == 'max_min_band')
        if top:
            paths = paths[:top]
        return [path['path'] for path in paths]

    def flatten(self, segs):
        """Flatten segs into hop-by-hop paths
        """
        paths = []
        for seg in segs:
            if not paths:
                paths = seg
            else:
                paths = [p1 + p2[1:] for p1 in paths for p2 in seg]
        return paths

    def cspf(self):
        """Return base paths and paths after exlude.
        """
        src = self.he
        sids = [*self.inc, self.te]
        segs = []
        rsv_segs = []
        for sid in sids:
            paths = self.revert([src, sid])[0]
            rsv_paths, rsv_exc = self.rsv(paths, self.exc)
            if not rsv_paths:
                rsv_topo = self.remake_topo(self.exc)
                topo = self.remake_topo(rsv_exc)
                rsv_paths = SPF(rsv_topo, src, sid, self.metric, self.loose, self.top).run()
                paths += SPF(topo, src, sid, self.metric, self.loose, self.top).run()
                paths += [path for path in rsv_paths if path not in paths]
            segs.append(paths)
            rsv_segs.append(rsv_paths)
            src = sid
        paths = self.tiebreaker(self.flatten(segs))
        rsv_paths = self.tiebreaker(self.flatten(rsv_segs), self.top, self.limit)
        return paths, rsv_paths

    def entropy(self, nodes, paths):
        """Node entropy by its counts in paths.
        If entropy is greater that 2, it's maybe a cross-node.
        """
        ent = {}
        for node in nodes:
            weight = 0
            for path in paths:
                if node in path:
                    weight += 1
            ent[node] = weight
        return ent

    def cut(self, paths, src, dest):
        """Cut paths with certain start & end.
        """
        rsv_segs = []
        for path in paths:
            if src in path and dest in path:
                idx_src = path.index(src)
                idx_dest = path.index(dest)
                path = path[idx_src:idx_dest + 1]
                if path not in rsv_segs:
                    rsv_segs.append(path)
        return rsv_segs

    def match(self, rsv_paths, path, src, dest):
        """Return if cspf-paths matches spf-paths.
        """
        spf_segs = SPF(self.topo, src, dest, 'igp').run()
        rsv_segs = self.cut(rsv_paths, src, dest)
        rsv_seg = self.cut([path], src, dest)[0]
        if rsv_seg not in spf_segs:
            return False
        else:
            for path in spf_segs:
                if path not in rsv_segs:
                    return False
        return True

    def encode(self, paths, rsv_paths):
        """Return encoded sids list.
        """
        sids_paths = []
        rev_paths = []
        for path in rsv_paths:
            if path not in rev_paths:
                sids = []
                nodes = [hop for hop in path[::2]]
                entropy = self.entropy(nodes, paths)
                print(entropy)
                xnodes = [ent for ent in entropy if entropy[ent] > 1]
                if len(xnodes) > 2:
                    head = self.he
                    src = self.he
                    temp = xnodes[1]
                    for xnode in xnodes[1:]:
                        if not self.match(rsv_paths, path, src, xnode):
                            idx = path.index(src)
                            node_adj = path[idx: idx + 2]
                            sids += node_adj
                            head = path[idx + 2]
                        elif head != src:
                            if entropy[src] >= entropy[temp]:
                                temp = src
                            if not self.match(rsv_paths, path, head, xnode):
                                if temp != src and head != temp:
                                    if not self.match(rsv_paths, path, temp, xnode):
                                        sids.append(src)
                                        head = src
                                    else:
                                        sids.append(temp)
                                        head = temp
                                else:
                                    sids.append(src)
                                    head = src
                        src = xnode
                else:
                    head = self.he
                    for node in nodes[1:]:
                        if not self.match(rsv_paths, path, head, node):
                            idx = path.index(node)
                            sids += path[idx - 2: idx]
                            head = node
                sids.append(self.te)
                segs = self.revert([self.he, *sids], True)
                rev_path = self.flatten(segs)
                sids_paths.append((sids, rev_path, segs))
                rev_paths += rev_path
        return sids_paths

    def disjoint(self, paths):
        """Return disjoint paths.
        """
        node_exc = {node for path in paths for node in path[2:-2:2]}
        link_exc = {link for path in paths for link in path[1::2]}
        cache_exc = set(self.exc)
        self.exc = self.exc.union(node_exc)
        paths, rsv_paths = self.cspf()
        if not rsv_paths:
            self.exc = cache_exc.union(link_exc)
            paths, rsv_paths = self.cspf()
        return paths, rsv_paths

    def sids(self, sids):
        """Supplement sid with certain details.
        """
        res = []
        for sid in sids:
            if sid in self.nodes:
                res.append({'id': sid, **self.nodes[sid]})
            else:
                res.append({'id': sid, **self.links[sid]})
        return res

    def tradeoff(self, paths):
        res = self.detail(paths[0])
        del res['path']
        for path in paths[1:]:
            detail = self.detail(path)
            res['igp'] = min(res['igp'], detail['igp'])
            res['te'] = min(res['te'], detail['te'])
            res['delay'] = min(res['delay'], detail['delay'])
            res['min_hop'] = min(res['min_hop'], detail['min_hop'])
            res['max_min_band'] = max(res['max_min_band'], detail['max_min_band'])
        return res

    @timer
    def run(self):
        """Client-easy builder method.
        """
        paths, rsv_paths = self.cspf()
        self.loose = False
        sids_paths = self.encode(paths, rsv_paths)
        if not sids_paths:
            res = {
                'sids': [],
                'paths': [],
                'segs': [],
                'attr': {},
                'other': []
            }
            return res
        collection = [{
            'sids': self.sids(sids),
            'paths': paths,
            'segs': segs,
            'attr': self.tradeoff(paths)
        } for sids, paths, segs in sids_paths]
        res = {
            **collection[0],
            'other': collection[1:]
        }
        if self.dis:
            res.update({
                'd_sids': [],
                'd_paths': [],
                'd_other': []
            })
            best_paths = sids_paths[0][1]
            d_paths, d_rsv_paths = self.disjoint(best_paths)
            if d_rsv_paths:
                d_sids_paths = self.encode(d_paths, d_rsv_paths)
                d_collection = [{
                    'd_sids': self.sids(sids),
                    'd_paths': paths,
                    'd_segs': segs,
                    'd_attr': self.tradeoff(paths)
                } for sids, paths, segs in d_sids_paths]
                res.update({
                    **d_collection[0],
                    'd_other': d_collection[1:]
                })
        return res


class Path(Topology):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.sids = kwargs.get('sids', [])
        self.sids_list = kwargs.get('sids_list', [])

    def revert(self, sids):
        """Turn a list of sids into segs of paths.
        """
        src, sids = sids[0], sids[1:]
        if src in self.links:
            src = self.links[src]['re']
        segs = []
        for sid in sids:
            if sid == src:
                continue
            if sid in self.links:
                lo = self.links[sid]['lo']
                re = self.links[sid]['re']
                if sid == lo:
                    paths = [[lo, sid, re]]
                else:
                    paths = SPF(self.topo, src, lo).run()
                    paths = [path + [sid, re] for path in paths]
                src = re
            else:
                paths = SPF(self.topo, src, sid).run()
                src = sid
            segs.append(paths)
        return segs

    def flatten(self, segs):
        """Flatten segs into hop-by-hop paths
        """
        paths = []
        for seg in segs:
            if not paths:
                paths = seg
            else:
                paths = [p1 + p2[1:] for p1 in paths for p2 in seg]
        return paths

    @timer
    def run(self):
        """Client-easy builder method.
        """
        if self.sids:
            segs = self.revert(self.sids)
            paths = self.flatten(segs)
            return {
                'paths': paths,
                'segs': segs
            }
        if self.sids_list:
            paths_list = []
            segs_list = []
            for sids in self.sids_list:
                segs = self.revert(sids)
                paths = self.flatten(segs)
                paths_list += [paths]
                segs_list += [segs]
            return {
                'paths': paths_list,
                'segs': segs_list
            }
