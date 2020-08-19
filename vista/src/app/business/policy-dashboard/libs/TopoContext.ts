
export class TopoContext {
    static labelToggle = false;
    static groupLabelToggle = true;
    static tooltipToggle = true;
    static bundleToggle = true;
    static bundleLabelToggle = true;
    static edgeLabelToggle = false;
    static emptyGroupObj = {
        type: 'circle',
        location: { x: 100, y: 100 },
        size: 100,
        color: 0x00ff00,
        opacity: 0.5,
    };

    static nodeRightMenu = [
        { label: '删除节点', id: 'removeNode' },
        { label: '查看Node详情', id: 'nodeDetail' },
        { label: '根据Headend过滤Path', id: 'filterPathByHeadend' },
        { label: '根据Tailend过滤Path', id: 'filterPathByTailend' },
        { label: 'Debug', id: 'debug' },
    ];
    private constructor() { }
}
