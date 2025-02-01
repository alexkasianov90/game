import { FormControl } from '@angular/forms';
import { GameSettings } from './game-settings';


export type SettingsForm = Record<SettingsKey, FormControl<number | null>>;

type SettingsKey = keyof GameSettings;
