import * as _ from 'lodash';
import * as g from './index';

export function isIn(v: number, low: number, high: number) {
  return v >= low && v <= high;
}

export function wrap(v: number, low: number, high: number) {
  const w = high - low;
  const o = v - low;
  if (o >= 0) {
    return o % w + low;
  } else {
    let wv = w + o % w + low;
    if (wv >= high) {
      wv -= w;
    }
    return wv;
  }
}

export function constrain(v: number, low: number, high: number) {
  if (v < low) {
    return low;
  } else if (v > high) {
    return high;
  }
  return v;
}

export function getDifficulty() {
  return g.scene === g.Scene.title ? 1 : g.ticks * (1 / 60 / 20) + 1;
}

export function getClassName(obj) {
  return ('' + obj.constructor).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1');
}

export class Vector {
  x = 0;
  y = 0;

  public constructor(x: number | Vector = null, y: number = null) {
    this.set(x, y);
  }

  set(x: number | Vector = null, y: number = null) {
    if (x == null) {
      this.x = this.y = 0;
      return;
    }
    if (x instanceof Vector) {
      this.x = x.x;
      this.y = x.y;
      return;
    }
    if (y == null) {
      this.x = this.y = x;
      return;
    }
    this.x = x;
    this.y = y;
  }

  magSq() {
    return this.x * this.x + this.y * this.y;
  }

  mag() {
    return Math.sqrt(this.magSq());
  }

  getAngle(to: Vector = null) {
    return to == null ? Math.atan2(this.y, this.x) : Math.atan2(to.y - this.y, to.x - this.x);
  }

  addAngle(angle: number, value: number) {
    this.x += Math.cos(angle) * value;
    this.y += Math.sin(angle) * value;
  }

  constrain
    (lowX: number, highX: number, lowY: number, highY: number) {
    this.x = constrain(this.x, lowX, highX);
    this.y = constrain(this.y, lowY, highY);
  }

  swapXy() {
    const t = this.x;
    this.x = this.y;
    this.y = t;
  }
}
