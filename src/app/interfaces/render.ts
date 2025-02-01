import { BaseObject } from '../game-objects/base-object';

export interface GameRender {
  init(container: HTMLElement): void;
  render(player: BaseObject | null, npc: BaseObject[]): void;
  clear(width: number, height: number): void
}
