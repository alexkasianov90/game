import { TestBed } from '@angular/core/testing';

import { CanvasRenderService } from './canvas-render.service';

describe('CanvasRenderService', () => {
  let service: CanvasRenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasRenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
