import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameSettingsComponent } from './components/game-settings/game-settings.component';
import { PlaygroundComponent } from './components/playground/playground.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameSettingsComponent, PlaygroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
