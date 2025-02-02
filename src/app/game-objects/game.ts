import { GameSettings } from '../interfaces/game-settings';
import { Player } from './player';
import {
  BehaviorSubject,
  distinctUntilChanged, endWith,
  finalize,
  map,
  Observable,
  Subject,
  Subscription, switchMap,
  take,
  takeUntil,
  tap, timer
} from 'rxjs';
import { BaseObject } from './base-object';
import { GameRender } from '../interfaces/render';
import { SaveGame } from '../interfaces/save-game';
import { defaultGameSettings } from '../const/default-game-config';
import { GAME_TICK } from '../const/game_tick';

export abstract class Game {
  public abstract NPC: Map<number, BaseObject>;
  public spawnerNPC$!: Observable<number>;
  protected gameEnd = new BehaviorSubject<boolean>(false);
  public gameEnd$ = this.gameEnd.asObservable();
  public isGameEnd = this.gameEnd.value;
  public game$!: Observable<number>;
  public time$!: Observable<number>;
  protected destroy = new Subject<void>();
  protected gameSettings = new BehaviorSubject<GameSettings>(defaultGameSettings);
  protected render!: GameRender;
  protected player: Player | null = null;
  protected width!: number;
  protected height!: number;
  protected gameOver: Subject<void> = new Subject<void>();
  protected spawnerNPCSub!: Subscription;
  protected restart = new Subject<void>()


  protected constructor (protected gameSaver: SaveGame) {
    this.setUpGame();
    this.setUpTimer();
  }
  public abstract checkCollision(): void;

  public abstract spawnNPC(): void;

  public abstract spawnPlayer(): Player;

  public abstract listenControls(): void;

  public abstract handleSaveGame(): void;

  public startNewGame(gameSettings: GameSettings) {
    this.initGameSettings(gameSettings);
    this.spawnObjects();
    this.startRendering();
    this.listenControls();
    this.handleSaveGame();
    this.restart.next();
  }

  public setUpSpawnerNPC() {
    this.spawnerNPCSub?.unsubscribe();
    this.spawnerNPC$ = this.gameSettings.asObservable().pipe(
      map(settings => settings.fallingFrequency),
      distinctUntilChanged(),
      switchMap(frequency => timer(0, frequency)),
      tap(() => this.spawnNPC()),
      takeUntil(this.gameOver),
      takeUntil(this.destroy)
    );
    this.spawnerNPCSub = this.spawnerNPC$.subscribe();
  }

  public endGame(): void {
    this.gameOver.next();
    this.gameOver.complete();
    this.gameSaver.destroy();
    this.NPC.clear();
  }

  public setContainerSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public setRenderer(render: GameRender, container: HTMLElement) {
    this.render = render;
    this.render.init(container);
  }

  public startRendering(): void {
    this.game$.subscribe(_ => {
      this.render.clear(this.width, this.height);
      this.render.render(this.player, Array.from(this.NPC.values()));
      this.checkCollision();
    })
  }

  public updateConfig(settings: GameSettings) {
    this.gameSettings.next(settings);
  }

  public getSettings(): GameSettings {
    return this.gameSettings.value;
  }

  protected setUpGame(): void {
    this.game$ = this.restart.asObservable().pipe(
      switchMap(_ => {
        this.gameOver = new Subject<void>;
        const takeCount = this.gameSettings.value.gameTime * 1000 / GAME_TICK;
        return timer(0, GAME_TICK).pipe(
          take(takeCount),
          finalize(() => {
            this.gameEnd.next(true);
            this.endGame();
          })
        );

      }),
      takeUntil(this.destroy)
    );
  }

  protected setUpTimer(): void {
    this.time$ = this.restart.asObservable().pipe(
      switchMap(_ => {
        return timer(0, 1000).pipe(
          map(seconds => this.gameSettings.value.gameTime - seconds),
          take(this.gameSettings.value.gameTime + 1),
        )
      }),
      endWith(0),
      takeUntil(this.destroy)
    );
  }
  protected initGameSettings(gameSettings: GameSettings): void {
    this.gameSaver.init();
    this.gameSettings.next(gameSettings);
    this.gameEnd.next(false);
  }

  protected spawnObjects(): void {
    this.player = this.spawnPlayer();
    this.setUpSpawnerNPC();
  }
}
