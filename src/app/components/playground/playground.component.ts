import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { CanvasRenderService } from '../../providers/canvas-render.service';
import { GameManagerService } from '../../providers/game-manager.service';
import { GameSettings } from '../../interfaces/game-settings';
import { GameSettingsComponent } from '../game-settings/game-settings.component';
import { AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [
    GameSettingsComponent,
    AsyncPipe,
    MatButton
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss'
})
export class PlaygroundComponent implements AfterViewInit {
  @ViewChild('playground') canvas!: ElementRef<HTMLCanvasElement>;

  public capture$ = this.gameManagerService.capture$;
  public time$ = this.gameManagerService.time$;
  public width = 1200;
  public height = 800;

  constructor (private canvasRenderService: CanvasRenderService,
               private gameManagerService: GameManagerService) {
  }


  ngAfterViewInit(): void {
    this.gameManagerService.setRenderer(this.canvasRenderService, this.canvas.nativeElement);
    this.gameManagerService.setContainerSize(this.width, this.height);
  }

  public updateSettings(settings: GameSettings) {
    if (this.gameManagerService.isGameEnd) {
      this.gameManagerService.startNewGame(settings);
      return;
    }
    if (this.isChangedGameTime(settings)) {
      this.gameManagerService.endGame();
      this.gameManagerService.startNewGame(settings);
    } else {
      this.gameManagerService.updateConfig(settings);
    }
  }

  private isChangedGameTime(settings: GameSettings): boolean {
    return this.gameManagerService.getSettings().gameTime !== settings.gameTime
  }
}
