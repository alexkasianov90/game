import { Position } from '../helpers/position';
import { Coordinates } from '../interfaces/coordinates';
import { generateID } from '../helpers/id-generator';

export class BaseObject {
  protected position = new Position();
  protected width: number;
  protected height: number;
  protected color: string = '#333';
  private id = generateID();

  constructor (width: number, height: number) {
    this.width = width;
    this.height = height;

  }

  public moveX(x: number): void {
    this.position.updateX(x);
  }

  public moveY(y: number): void {
    this.position.updateY(y);
  }

  public spawn(position: Coordinates): void {
    this.position.updateX(position.x);
    this.position.updateY(position.y);
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public getPosition(): Coordinates {
    return {...this.position.getCurrentPosition()};
  }
  public getWidth(): number {
    return this.width;
  }

  public getHeight() {
    return this.height;
  }

  public getColor(): string {
    return this.color;
  }

  public getID(): number {
    return this.id;
  }
}
