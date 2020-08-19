
import Point from '../../../../assets/libs/point';
import ConvexHullGrahamScan from '../../../../assets/libs/convex-hull';
import SvgUtil from '../../../../assets/libs/svg-util';

import * as _ from 'lodash';
import * as d3 from 'd3';
import * as jsts from 'jsts';

export class Group {
  public type = 'group';
  public shapeType = 'polygon';
  public groupId = '';
  private childrenNode: any[] = [];
  private labelContent = '';
  private labelPosition = 'Above'; // Above, Center, Below
  private convexHull: any;
  private inflatePoly: any;

  private OFFSET = 40;
  public defaultStyle = {
    stroke: '#F5EDF3',
    strokeWidth: 1,
    fill: 'transparent',
    fillOpacity: 1
  };
  constructor(groupData: any) {
    this.groupId = groupData.id;
    this.labelContent = groupData.labelContent;
    this.childrenNode = groupData.childrenNode;
  }

  public draw(parentEl?: any) {
    // console.log('Group draw');
    if (!parentEl) {
      parentEl = d3.select('g.as-group');
    }

    const groupEl = this.getGroupById();
    if (groupEl) {
      d3.select(`#${this.groupId}`).remove();
    }
    this.preparePolygonData();
    const asEl = parentEl.append('g')
    .attr('id', this.groupId)
    .attr('class', 'as');
    this.drawOffsetPolygon(asEl);

  }

  public getChildNodes() {
    return this.childrenNode;
  }

  private getGroupById() {
    return document.getElementById(this.groupId);
  }

  private preparePolygonData() {
    // console.log('group->preparePolygonData');
    if (this.childrenNode.length === 1) {
      this.shapeType = 'circle';
      this.convexHull = this.nodesToPoints(this.childrenNode);
      this.inflatePoly = null;
    } else if (this.childrenNode.length >= 2) {
      this.shapeType = 'polygon';

      // make convex hull
      this.convexHull = this.getConvexHull(this.nodesToCoordinates(this.childrenNode));

      this.inflatePoly = this.getOffsetPolygon(this.convexHull, this.OFFSET);
    }

  }

  private nodesToPoints(nodes: any) {
    return _.map(nodes, (node) => {
      return {
        x: node.x,
        y: node.y,
      };
    });
  }

  private nodesToCoordinates(nodes: any) {
    return _.map(nodes, (node) => {
      return [node.x, node.y];
    });
  }

  private getConvexHull(points: number[][]) {
    const convexHullScan = new ConvexHullGrahamScan();
    return convexHullScan.addPoints(points).getHull();
  }

  private vectorCoordinates2JTS(points: Point[]) {
    const coordinates = [];

    for (const point of points) {
      coordinates.push(new jsts.geom.Coordinate(point.x, point.y));
    }
    return coordinates;
  }

  private getOffsetPolygon(points: Point[], spacing) {
    const type = points.length === 2 ? 'line' : 'polygon';
    const geoInput = this.vectorCoordinates2JTS(points);
    if (type === 'polygon') {
      geoInput.push(geoInput[0]);
    }

    const geometryFactory = new jsts.geom.GeometryFactory();
    const shell = type === 'polygon' ? geometryFactory.createPolygon(geoInput) : geometryFactory.createLineString(geoInput);
    const polygon = shell.buffer(spacing, jsts.operation.buffer.BufferParameters.CAP_SQUARE);

    const inflatedCoordinates = [];
    const oCoordinates = polygon.shell.points.coordinates;
    for (const oItem of oCoordinates) {
      inflatedCoordinates.push(new Point(Math.ceil(oItem.x), Math.ceil(oItem.y)));
    }
    return inflatedCoordinates;
  }

  private drawOffsetPolygon(parentEl: any) {

    let groupEl = null;
    if (this.shapeType === 'polygon') {
      const polygonPoints = SvgUtil.makePolygonPoints(this.inflatePoly);

      groupEl = parentEl.append('polygon')
        .attr('points', polygonPoints);

    } else if (this.shapeType === 'circle') {
      const center = this.childrenNode[0];
      groupEl = parentEl.append('circle')
        .attr('cx', center.x)
        .attr('cy', center.y)
        .attr('r', this.OFFSET);
    }
    groupEl.attr('fill', this.defaultStyle.fill)
    .attr('fill-opacity', this.defaultStyle.fillOpacity)
    .attr('stroke', this.defaultStyle.stroke)
    .attr('stroke-width', this.defaultStyle.strokeWidth);

    this.setLabel(parentEl, this.labelContent);

  }

  public setLabel(parentEl: any, content: string, position?: string, style?: any) {
    const labelId = `group_lable_${this.groupId}`;
    const labelDom = document.getElementById(labelId);
    if (labelDom) {
      parentEl.select(`#${labelId}`).remove();
    }
    const labelPos = this.getLabelPos(parentEl);
    if (position) {
      this.labelPosition = position;
    }
    if (!style) {
      style = {
        fontFamily: 'sans-serif',
        fontSize: 12,
        fill: 'red',
      };
    }
    parentEl.append('text')
        .text(content)
        .attr('id', labelId)
        .attr('class', 'as-text-name')
        .attr('x', labelPos.x)
        .attr('y', labelPos.y)
        .attr('font-family', style.fontFamily)
        .attr('font-size', style.fontSize);
  }

  private getLabelPos(parentEl: any) {
    const bbox = parentEl.node().getBBox();
    const groupWidth = bbox.width;
    const groupHeight = bbox.height;
    const groupX = bbox.x;
    const groupY = bbox.y;

    // console.log('bbox', bbox);
    const centerPoint = { x: groupX + groupWidth / 2, y: groupY + groupHeight / 2 };
    const labelPos = { x: 0, y: 0 };
    // 与centerPoint的偏移量
    const labelPositionData: any = {
      Center: {
        x: 0,
        y: 0,
      },
      Above: {
        x: 0,
        y: -(groupHeight / 2),
      },
      Below: {
        x: 0,
        y: (groupHeight / 2),
      },
    };

    labelPos.x = centerPoint.x + labelPositionData[this.labelPosition].x;
    labelPos.y = centerPoint.y + labelPositionData[this.labelPosition].y;

    if (this.shapeType === 'polygon' && this.labelPosition === 'Above') {
      const topPoint = this.getTopPoint(this.convexHull);
      labelPos.x = topPoint.x;
      labelPos.y = topPoint.y - this.OFFSET;
    }
    return labelPos;
  }

  private getTopPoint(points: Point[]) {
    const newPoints = points.slice();
    newPoints.sort((a: Point, b: Point) => {
      if (Math.round(a.y) < Math.round(b.y)) {
        return -1;
      } else if (Math.round(a.y) > Math.round(b.y)) {
        return 1;
      } else if (Math.round(a.x) < Math.round(b.x)) {
        return 1;
      } else if (Math.round(a.x) > Math.round(b.x)) {
        return -1;
      } else {
        return 0;
      }
    });

    return newPoints[0];
  }

  public initStyle(style: any) {
    this.defaultStyle = _.extend(this.defaultStyle, style);
  }

}
