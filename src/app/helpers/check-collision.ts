import { BaseObject } from '../game-objects/base-object';

export function checkCircleRectCollision(
  player: BaseObject,
  fruit: BaseObject
): boolean {
  const playerPosition = player.getPosition();
  const fruitPosition = fruit.getPosition();
  let nearestX = Math.max(playerPosition.x, Math.min(fruitPosition.x, playerPosition.x + player.getWidth()));
  let nearestY = Math.max(playerPosition.y, Math.min(fruitPosition.y, playerPosition.y + player.getHeight()));

  let deltaX = fruitPosition.x - nearestX;
  let deltaY = fruitPosition.y - nearestY;
  const radius = fruit.getWidth()  / 2;
  return (deltaX * deltaX + deltaY * deltaY) <= (radius * radius);
}
