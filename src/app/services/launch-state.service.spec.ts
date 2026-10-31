import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';

import { Launch } from '../core/models/launch.model';
import { makeLaunch } from '../../testing/launch.fixtures';
import { GraphqlService } from './graphql.service';
import { LaunchStateService } from './launch-state.service';

describe('LaunchStateService', () => {
  let service: LaunchStateService;
  let getLaunches: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getLaunches = vi.fn();
    TestBed.configureTestingModule({
      providers: [{ provide: GraphqlService, useValue: { getLaunches } }],
    });
    service = TestBed.inject(LaunchStateService);
  });

  it('starts empty and idle', () => {
    expect(service.launches()).toEqual([]);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
    expect(service.hasError()).toBe(false);
  });

  it('is loading while the request is pending', () => {
    const response = new Subject<Launch[]>();
    getLaunches.mockReturnValue(response);

    service.fetchLaunches();
    expect(service.loading()).toBe(true);

    response.next([makeLaunch()]);
    expect(service.loading()).toBe(false);
  });

  it('stores the fetched launches', () => {
    const launches = [makeLaunch()];
    getLaunches.mockReturnValue(of(launches));

    service.fetchLaunches();

    expect(service.launches()).toEqual(launches);
    expect(service.hasError()).toBe(false);
  });

  it('stores the error and keeps the previous launches on failure', () => {
    const launches = [makeLaunch()];
    const failure = new Error('boom');
    getLaunches.mockReturnValueOnce(of(launches)).mockReturnValueOnce(throwError(() => failure));

    service.fetchLaunches();
    service.fetchLaunches();

    expect(service.error()).toBe(failure);
    expect(service.hasError()).toBe(true);
    expect(service.loading()).toBe(false);
    expect(service.launches()).toEqual(launches);
  });

  it('clears a previous error when fetching again', () => {
    getLaunches.mockReturnValueOnce(throwError(() => new Error('boom'))).mockReturnValueOnce(of([]));

    service.fetchLaunches();
    service.fetchLaunches();

    expect(service.hasError()).toBe(false);
  });

  it('ignores the result of a superseded request', () => {
    const first = new Subject<Launch[]>();
    const second = new Subject<Launch[]>();
    getLaunches.mockReturnValueOnce(first).mockReturnValueOnce(second);

    service.fetchLaunches();
    service.fetchLaunches();
    first.next([makeLaunch({ id: 'stale' })]);

    expect(first.observed).toBe(false);
    expect(service.launches()).toEqual([]);

    second.next([makeLaunch({ id: 'fresh' })]);
    expect(service.launches().map((l) => l.id)).toEqual(['fresh']);
  });
});
