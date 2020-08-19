import * as _ from 'lodash';
import Point from './point';

export default class MathUtil {

  /**
   * convert radian to angle
   * @param radian radian
   */
  public static radianToAngle(radian: number) {
    return 180 / Math.PI * radian;
  }

  /**
   * convert angle to radian
   * @param angle angle
   */
  public static angleToRadian(angle: number) {
    return Math.PI / 180 * angle;
  }

  /**
   * get point's coordinate on a circle
   * @param cx cx of circle
   * @param cy cy of circle
   * @param r radius of circle
   * @param radian radian of the target point on the circle
   */
  public static getPointOnCircle(cx: number, cy: number, r: number, radian: number) {
    const pointObj = {
      x: cx + r * Math.cos(radian),
      y: cy + r * Math.sin(radian)
    };
    return pointObj;
  }

  /**
   * get slope of line
   * @param p1 point on the line
   * @param p2 point on the line
   */
  public static getLineSlope(p1: Point, p2: Point) {
    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;
    if (x1 === x2) { return 0; }
    return (y2 - y1) / (x2 - x1);
  }

  /**
   * 获取中垂线上的控制点
   * @param p1 start point
   * @param p2 end point
   * @param offset offset of perpendicular line
   */
  public static controlPointGenerator(p1, p2, offset) {
    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;
    const midx = (x1 + x2) / 2;
    const midy = (y1 + y2) / 2;

    // angle of perpendicular to line:
    const theta = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2;

    const cpx = midx + offset * Math.cos(theta);
    const cpy = midy + offset * Math.sin(theta);
    return { x: cpx, y: cpy };
  }

  public static getCenterOfPoints(points: Point[]) {
    const center: Point = new Point(0, 0);
    let x = 0;
    let y = 0;
    for (const point of points) {
      x += point.x;
      y += point.y;
    }
    center.x = x / points.length;
    center.y = y / points.length;
    return center;
  }

}
