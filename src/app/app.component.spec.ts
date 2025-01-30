import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    schemas: [NO_ERRORS_SCHEMA],
    detectChanges: false,
  });
  let component: AppComponent;
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
