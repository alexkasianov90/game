import { BaseObject } from './base-object';
import { getRandomInRange } from '../helpers/get-random-range';
import { fruitsColor } from '../helpers/fruits-color';

export class Fruit extends BaseObject {
  public caught = false;
  public radius!: number;

  constructor(width: number, height: number, radius: number) {
    super(width, height);
    this.radius = radius;
    this.color = fruitsColor[getRandomInRange(0, fruitsColor.length - 1)];
  }
}
