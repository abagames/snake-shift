export default class Random {
  x: number;
  y: number;
  z: number;
  w: number;

  get(fromOrTo: number = 1, to: number = null) {
    if (to == null) {
      to = fromOrTo;
      fromOrTo = 0;
    }
    return this.getToMaxInt() / 0x7fffffff * (to - fromOrTo) + fromOrTo;
  }

  getInt(fromOrTo: number = 1, to: number = null) {
    return Math.floor(this.get(fromOrTo, to));
  }

  getPm() {
    return this.getInt(2) * 2 - 1;
  }

  select(values: any[]) {
    return values[this.getInt(values.length)];
  }

  setSeed(v: number = -0x7fffffff) {
    if (v === -0x7fffffff) {
      v = Math.floor(Math.random() * 0x7fffffff);
    }
    this.x = v = 1812433253 * (v ^ (v >> 30))
    this.y = v = 1812433253 * (v ^ (v >> 30)) + 1
    this.z = v = 1812433253 * (v ^ (v >> 30)) + 2
    this.w = v = 1812433253 * (v ^ (v >> 30)) + 3;
    return this;
  }

  getToMaxInt() {
    var t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = (this.w ^ (this.w >> 19)) ^ (t ^ (t >> 8));
    return this.w;
  }

  constructor() {
    this.setSeed();
  }
}
