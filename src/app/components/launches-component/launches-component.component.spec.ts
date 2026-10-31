import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritableSignal, computed, signal } from '@angular/core';

import { Launch } from '../../core/models/launch.model';
import { LaunchStateService } from '../../services/launch-state.service';
import { makeLaunch } from '../../../testing/launch.fixtures';
import { LaunchesComponent, launchSortValue } from './launches-component.component';

const LAUNCHES: Launch[] = [
  makeLaunch({
    id: '1',
    mission_name: 'Bravo',
    launch_year: '2010',
    rocket: { rocket_name: 'Falcon 9', rocket_type: 'v1.0' },
    launch_site: { site_id: 'b', site_name: 'B', site_name_long: 'Cape Canaveral' },
  }),
  makeLaunch({
    id: '2',
    mission_name: 'Alpha',
    launch_year: '2006',
    rocket: { rocket_name: 'Falcon 1', rocket_type: 'Merlin A' },
    launch_site: { site_id: 'a', site_name: 'A', site_name_long: 'Kwajalein Atoll' },
  }),
];

describe('LaunchesComponent', () => {
  let fixture: ComponentFixture<LaunchesComponent>;
  let component: LaunchesComponent;
  let launches: WritableSignal<Launch[]>;
  let loading: WritableSignal<boolean>;
  let error: WritableSignal<unknown>;
  let fetchLaunches: ReturnType<typeof vi.fn>;

  const element = () => fixture.nativeElement as HTMLElement;
  const rowTexts = () =>
    Array.from(element().querySelectorAll('tr.mat-mdc-row td:first-child')).map((td) => td.textContent?.trim());

  beforeEach(async () => {
    launches = signal<Launch[]>([]);
    loading = signal(false);
    error = signal<unknown>(null);
    fetchLaunches = vi.fn();

    await TestBed.configureTestingModule({
      imports: [LaunchesComponent],
      providers: [
        {
          provide: LaunchStateService,
          useValue: {
            launches,
            loading,
            error,
            hasError: computed(() => error() !== null),
            fetchLaunches,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LaunchesComponent);
    component = fixture.componentInstance;
  });

  it('fetches launches on init', async () => {
    await fixture.whenStable();
    expect(fetchLaunches).toHaveBeenCalledTimes(1);
  });

  it('shows a spinner while loading', async () => {
    loading.set(true);
    await fixture.whenStable();

    expect(element().querySelector('mat-spinner')).not.toBeNull();
    expect(element().querySelector('table')).toBeNull();
  });

  it('shows the error state and retries on demand', async () => {
    error.set(new Error('boom'));
    await fixture.whenStable();

    expect(element().querySelector('.error-container')).not.toBeNull();
    expect(element().querySelector('table')).toBeNull();

    element().querySelector<HTMLButtonElement>('.error-container button')!.click();
    expect(fetchLaunches).toHaveBeenCalledTimes(2);
  });

  it('renders a row per launch', async () => {
    launches.set(LAUNCHES);
    await fixture.whenStable();

    expect(component.dataSource.data).toEqual(LAUNCHES);
    expect(rowTexts()).toEqual(['Bravo', 'Alpha']);
    expect(element().textContent).toContain('Falcon 9 (v1.0)');
    expect(element().textContent).toContain('Cape Canaveral');
  });

  it('shows an empty-state row when there are no launches', async () => {
    await fixture.whenStable();
    expect(element().querySelector('.no-data')?.textContent).toContain('No launches found');
  });

  it('wires sort and paginator once the table is rendered after loading', async () => {
    loading.set(true);
    await fixture.whenStable();
    expect(component.dataSource.sort).toBeNull();

    loading.set(false);
    launches.set(LAUNCHES);
    await fixture.whenStable();

    expect(component.dataSource.sort).not.toBeNull();
    expect(component.dataSource.paginator).not.toBeNull();
  });

  it('sorts by the nested rocket name column', async () => {
    launches.set(LAUNCHES);
    await fixture.whenStable();

    component.dataSource.sort!.sort({ id: 'rocket_name', start: 'asc', disableClear: false });
    await fixture.whenStable();

    expect(rowTexts()).toEqual(['Alpha', 'Bravo']);
  });
});

describe('launchSortValue', () => {
  const launch = LAUNCHES[0];

  it('resolves nested and numeric columns', () => {
    expect(launchSortValue(launch, 'mission_name')).toBe('Bravo');
    expect(launchSortValue(launch, 'launch_year')).toBe(2010);
    expect(launchSortValue(launch, 'rocket_name')).toBe('Falcon 9');
    expect(launchSortValue(launch, 'launch_site')).toBe('Cape Canaveral');
  });

  it('falls back to an empty value for unknown columns', () => {
    expect(launchSortValue(launch, 'unknown')).toBe('');
  });
});
