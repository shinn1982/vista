import * as _ from 'lodash';
import Point from './point';
import { COLOR_MAP } from './colorMap';

export default class BezierUtil {

  public static getCurveColor(n: number, alpha?: number) {
    alpha = alpha || 0.65;
    const tmp = COLOR_MAP[n % 16];
    const hex = tmp[_.floor(_.divide(n, 16))];
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const color = `rgba(${parseInt(rgb[1], 16)}, ${parseInt(rgb[2], 16)}, ${parseInt(rgb[3], 16)}, ${alpha})`;
    return color || `rgba(0, 188, 212, ${alpha})`;
  }

  public static drawCruve(canvasId: string, points: Array<any>, lineColor: string) {
    // offset
    const endPoint = points[points.length - 1];
    const nearEndPoint = points[points.length - 2];
    const dx = endPoint.x - nearEndPoint.x;
    const dy = endPoint.y - nearEndPoint.y;
    const angle = Math.atan2(dy, dx);
    const r = 20;  // radius of node
    const newX = endPoint.x - Math.cos(angle) * (r + 9 * 1.5);
    const newY = endPoint.y - Math.sin(angle) * (r + 9 * 1.5);
    endPoint.x = newX;
    endPoint.y = newY;

    const controlPoints = BezierUtil.getCurveControlPoints(points);
    const fp = controlPoints.firstControlPoints;
    const sp = controlPoints.secondControlPoints;
    const canvasDom = document.getElementById(canvasId);
    canvasDom.style.display = 'initial';
    const ctx = (canvasDom as any).getContext('2d');
    ctx.lineWidth = 9;

    // draw bezier
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.bezierCurveTo(fp[i - 1].x, fp[i - 1].y, sp[i - 1].x, sp[i - 1].y, points[i].x, points[i].y);
    }
    ctx.strokeStyle = lineColor;
    ctx.shadowColor = 'rgba(0,0,0,.3)';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.closePath();

    // draw arrow
    const endingAngle = BezierUtil.calcArrowAngle(points, fp, sp);
    const size = ctx.lineWidth;
    ctx.beginPath();
    ctx.save();
    ctx.translate(points[points.length - 1].x, points[points.length - 1].y);
    ctx.rotate(endingAngle);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size);
    ctx.lineTo(size * 1.5, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = lineColor;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fill();
    ctx.restore();
  }

  public static getCurveControlPoints(knots: Array<any>) {
    const firstControlPoints = [];
    const secondControlPoints = [];
    const n = knots.length - 1;
    if (n < 1) {
      return;
    }
    if (n === 1) {
      const P1 = new Point(
        (2 * knots[0].x + knots[1].x) / 3,
        (2 * knots[0].y + knots[1].y) / 3
      );
      firstControlPoints.push(P1);

      const P2 = new Point(
        2 * firstControlPoints[0].x - knots[0].x,
        2 * firstControlPoints[0].y - knots[0].y
      );
      secondControlPoints.push(P2);
      return { firstControlPoints, secondControlPoints };
    }

    const rhs = [];
    for (let i = 0; i < n - 1; ++i) {
      rhs[i] = 4 * knots[i].x + 2 * knots[i + 1].x;
      rhs[0] = knots[0].x + 2 * knots[1].x;
      rhs[n - 1] = (8 * knots[n - 1].x + knots[n].x) / 2.0;
    }
    const x = this.getFirstControlPoints(rhs);
    for (let i = 0; i < n - 1; ++i) {
      rhs[i] = 4 * knots[i].y + 2 * knots[i + 1].y;
      rhs[0] = knots[0].y + 2 * knots[1].y;
      rhs[n - 1] = (8 * knots[n - 1].y + knots[n].y) / 2.0;
    }
    const y = this.getFirstControlPoints(rhs);

    for (let i = 0; i < n; ++i) {
      firstControlPoints[i] = new Point(x[i], y[i]);
      if (i < n - 1) {
        secondControlPoints[i] = new Point(
          2 * knots[i + 1].x - x[i + 1],
          2 * knots[i + 1].y - y[i + 1]
        );
      } else {
        secondControlPoints[i] = new Point(
          (knots[n].x + x[n - 1]) / 2,
          (knots[n].y + y[n - 1]) / 2
        );
      }
    }

    return { firstControlPoints, secondControlPoints };
  }

  public static getFirstControlPoints(rhs: Array<any>) {
    const n = rhs.length;
    const x = [];  // Solution vector.
    const tmp = [];  // Temp workspace.
    let b = 2.0;

    x[0] = rhs[0] / b;
    // Decomposition and forward substitution.
    for (let i = 1; i < n; i++) {
      tmp[i] = 1 / b;
      b = (i < n - 1 ? 4.0 : 3.5) - tmp[i];
      x[i] = (rhs[i] - x[i - 1]) / b;
    }
    // Backsubstitution.
    for (let i = 1; i < n; i++) {
      x[n - i - 1] -= tmp[n - i] * x[n - i];
    }

    return x;
  }

  public static calcArrowAngle(points: Array<any>, fp: Array<any>, sp: Array<any>) {
    const i = points.length - 1;
    const pointNearEnd = BezierUtil.getCubicBezierXYatT(
      { x: points[i - 1].x, y: points[i - 1].y },
      { x: fp[i - 1].x, y: fp[i - 1].y },
      { x: sp[i - 1].x, y: sp[i - 1].y },
      { x: points[i].x, y: points[i].y },
      0.99
    );
    const dx = points[i].x - pointNearEnd.x;
    const dy = points[i].y - pointNearEnd.y;
    const endingAngle = Math.atan2(dy, dx);
    return endingAngle;
  }

  public static getCubicBezierXYatT(startPt, controlPt1, controlPt2, endPt, T) {
    const x = BezierUtil.cubicN(T, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
    const y = BezierUtil.cubicN(T, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
    return ({ x, y });
  }

  public static cubicN(T, a, b, c, d) {
    const t2 = T * T;
    const t3 = t2 * T;
    return a + (-a * 3 + T * (3 * a - a * T)) * T + (3 * b + T * (-6 * b + b * 3 * T)) * T + (c * 3 - c * 3 * T) * t2 + d * t3;
  }
}
