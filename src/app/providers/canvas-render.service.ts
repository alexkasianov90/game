import { Injectable } from '@angular/core';
import { GameRender } from '../interfaces/render';
import { BaseObject } from '../game-objects/base-object';

@Injectable({
  providedIn: 'root'
})
export class CanvasRenderService implements GameRender {
  public ctx: CanvasRenderingContext2D | null = null;
  constructor() { }

  init(canvas: HTMLCanvasElement): void {
    this.ctx = canvas.getContext('2d');
  }

  render(player: BaseObject | null, npc: BaseObject[]): void {
    if (player) {
      this.renderPlayer(player);
    }
    this.renderOtherObjects(npc);

  }

  private renderPlayer(player: BaseObject): void {
    if (!this.ctx) {
      return;
    }
    this.drawRect(player, this.ctx);
  }

  private renderOtherObjects(objects: BaseObject[]): void {
    if (!this.ctx) {
      return;
    }
    objects.forEach(object => {
     this.drawCircle(object, this.ctx as CanvasRenderingContext2D);
    })
  }

  private drawRect(object: BaseObject, ctx: CanvasRenderingContext2D): void {
    const objectPosition = object.getPosition();
    ctx.beginPath();
    ctx.rect(objectPosition.x, objectPosition.y, object.getWidth(), object.getHeight());
    ctx.fillStyle = object.getColor();
    ctx.fill();
  }

  private drawCircle(object: BaseObject, ctx: CanvasRenderingContext2D): void {
    const objectPosition = object.getPosition();
    ctx.beginPath();
    ctx.arc(objectPosition.x, objectPosition.y, object.getWidth() / 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = object.getColor();
  }

  public clear(width: number, height: number): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, width, height);
    }
  }

}
