import { Injectable, OnDestroy } from '@angular/core';
import { Game } from '../game-objects/game';
import { Player } from '../game-objects/player';
import {
  BehaviorSubject,
  filter,
  finalize,
  fromEvent,
  interval,
  takeUntil,
  takeWhile
} from 'rxjs';
import { Fruit } from '../game-objects/fruit';
import { getRandomInRange } from '../helpers/get-random-range';
import { checkCircleRectCollision } from '../helpers/check-collision';
import { WebsocketService } from './websocket.service';
import { playKeys } from '../const/play-key';
import { GAME_TICK } from '../const/game_tick';
import { playerStats } from '../const/player';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService extends Game implements OnDestroy {
  public NPC: Map<number, Fruit> = new Map<number, Fruit>();
  private capture = new BehaviorSubject<number>(0);
  public capture$ = this.capture.asObservable();
  constructor(private websocketService: WebsocketService) {
    super(websocketService);
  }

  public spawnPlayer(): Player {
    const player = new Player(playerStats.size, playerStats.size);
    const xPos = this.width / 2 - (playerStats.size / 2);
    this.capture.next(0);
    player.setColor(playerStats.color);
    player.spawn({x: xPos, y: this.height - playerStats.size});
    return player;
  }

  public spawnNPC(): void {
    const size = 40;
    const radius = 20;
    const fruit = new Fruit(size, size, radius);
    const randomXCoordinate = getRandomInRange(0, this.width - radius);
    fruit.spawn({x: randomXCoordinate, y: radius});
    this.NPC.set(fruit.getID(), fruit);
    this.startDropFruit(fruit);
  }

  public listenControls(): void {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(event => event.key === playKeys.ArrowLeft || event.key === playKeys.ArrowRight),
        takeUntil(this.gameOver),
      )
      .subscribe(event => {
        this.handleRightMove(event);
        this.handleLeftMove(event);
      });
  }

  public checkCollision(): void {
    if (this.player) {
      this.NPC.forEach(fruit => {
        if (!fruit.caught && checkCircleRectCollision(this.player as Player, fruit)) {
          let captured = this.capture.value + 1;
          fruit.caught = true;
          this.capture.next(captured);
        }
      })
    }
  }

  public handleSaveGame(): void {
    this.time$.subscribe(time => {
      this.gameSaver.save({timeLeft: time, capture: this.capture.value});
    });
  }

  public ngOnDestroy(): void {
    this.endGame();
    this.destroy.next();
    this.destroy.complete();
  }

  private startDropFruit(fruit: Fruit): void {
    interval(GAME_TICK).pipe(
      takeUntil(this.gameOver),
      takeWhile(_ => fruit.getPosition().y < this.height + fruit.getHeight() * 2 || fruit.caught),
      finalize(() => {
        this.NPC.delete(fruit.getID());
      })
    ).subscribe(_ => {
        const currentY = fruit.getPosition().y;
        fruit.moveY(currentY + this.gameSettings.value.fallingSpeed);
    })
  }

  private handleRightMove(event: KeyboardEvent): void {
    if (!this.player) {
      return;
    }
    const currentX = this.player.getPosition().x || 0;
    if (event.key === playKeys.ArrowRight && currentX < this.width - this.player.getWidth()) {
      this.player.moveX(currentX + this.gameSettings.value.playerSpeed);
    }
  }

  private handleLeftMove(event: KeyboardEvent): void {
    if (!this.player) {
      return;
    }
    const currentX = this.player.getPosition().x || 0;
    if (event.key === playKeys.ArrowLeft && currentX > 0) {
      this.player.moveX(currentX - this.gameSettings.value.playerSpeed);
    }
  }
}
