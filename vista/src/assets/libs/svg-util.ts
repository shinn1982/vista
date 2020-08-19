import * as _ from 'lodash';
import Point from './point';
import * as d3 from 'd3';

export default class SvgUtil {

  public static pointsToCoordinates(points: any[]) {
    return _.map(points, (p) => {
      return [p.x, p.y];
    });
  }

  public static makePolygonPoints(points: Point[]) {
    return points.map((p) => {
      return [p.x, p.y].join(',');
    }).join(' ');
  }

  public static makePath(points: any[]) {
    const s = points.map((point, i) => {
      return (i === 0 ? 'M' : 'L') + point.x + ',' + point.y;
    }).join('') + 'Z';

    return s;
  }



  public static setAttributes(selection: any, objAttr: any) {
    for (const attrName of Object.keys(objAttr)) {
      selection.attr(attrName, objAttr[attrName]);
    }
    return selection;
  }

  public static anticlockwiseRotate(selector: string) {
    /**
     * brief: anticlockwise link label rotate
     */
    const selection = d3.selectAll(selector);
    selection.each(function(perEl: any) {
      perEl.rotate = perEl.clockwise ? 0 : 180;
      const obj = (this as SVGGraphicsElement).getBBox();

      const center = { x: obj.x + (obj.width / 2), y: obj.y + (obj.height / 2) };
      d3.select(this)
        .attr('transform', () => {
          return `rotate(${perEl.rotate},${center.x},${center.y})`;
        });
    });
  }


}
