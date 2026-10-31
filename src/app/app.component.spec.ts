import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { AppComponent } from './app.component';
import { LaunchStateService } from './services/launch-state.service';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: LaunchStateService,
          useValue: {
            launches: signal([]),
            loading: signal(false),
            hasError: signal(false),
            fetchLaunches: vi.fn(),
          },
        },
      ],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the launches view with its heading', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('SpaceX Launches');
    expect(compiled.querySelector('app-launches')).not.toBeNull();
  });
});
