import { Coordinates } from '../interfaces/coordinates';

export class Position {
  private x!: number;
  private y!: number;

  constructor (x = 0, y = 0) {
    this.updateX(x);
    this.updateY(y);
  }

  public updateX (x: number): void {
    this.x = x;
  }
  public updateY (y: number): void {
    this.y = y;
  }

  public getCurrentPosition(): Coordinates {
    return {x: this.x, y: this.y};
  }
}
