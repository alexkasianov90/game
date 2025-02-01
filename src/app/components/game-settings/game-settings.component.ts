import { ChangeDetectionStrategy, Component, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsForm } from '../../interfaces/settings-form';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { debounceTime, filter } from 'rxjs';
import { GameSettings } from '../../interfaces/game-settings';
import { ErrorStateMatcher } from '@angular/material/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-game-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatError,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-settings.component.html',
  styleUrl: './game-settings.component.scss'
})
export class GameSettingsComponent implements OnInit {
  public updateSettings = output<GameSettings>();
  public matcher = new MyErrorStateMatcher();
  public settingsForm = new FormGroup<SettingsForm>({
    fallingSpeed: new FormControl(null, [Validators.required, Validators.min(2), Validators.max(10)]),
    fallingFrequency: new FormControl(null, [Validators.required, Validators.min(100), Validators.max(3000)]),
    playerSpeed: new FormControl(null, [Validators.required, Validators.min(2), Validators.max(14)]),
    gameTime:  new FormControl(null, [Validators.required, Validators.min(10), Validators.max(120)]),
  });

  private formValueChanges$ = this.settingsForm.valueChanges.pipe(
    filter(_ => this.settingsForm.valid),
    debounceTime(200),
    takeUntilDestroyed()
  );

  ngOnInit(): void {
    this.formValueChanges$.subscribe(value => {
      this.updateSettings.emit(value as GameSettings);
    });
  }
}
