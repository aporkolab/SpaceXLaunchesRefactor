import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { LaunchesComponent } from './launches-component.component';
import { LaunchStateService } from '../../services/launch-state.service';
import { Launch } from '../../core/models/launch.model';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const MOCK_LAUNCHES: Launch[] = [
  { id: '1', mission_name: 'Test Mission 1', launch_year: '2025' } as Launch,
  { id: '2', mission_name: 'Test Mission 2', launch_year: '2026' } as Launch,
];

describe('LaunchesComponent', () => {
  let component: LaunchesComponent;
  let fixture: ComponentFixture<LaunchesComponent>;
  let mockLaunchStateService: MockedObject<LaunchStateService>;
  let launchesSubject: BehaviorSubject<Launch[]>;
  let loadingSubject: BehaviorSubject<boolean>;
  let errorSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    launchesSubject = new BehaviorSubject<Launch[]>([]);
    loadingSubject = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<any>(null);

    mockLaunchStateService = {
      fetchLaunches: vi.fn().mockName('LaunchStateService.fetchLaunches'),
      launches$: launchesSubject.asObservable(),
      loading$: loadingSubject.asObservable(),
      error$: errorSubject.asObservable(),
    } as unknown as MockedObject<LaunchStateService>;

    await TestBed.configureTestingModule({
      declarations: [LaunchesComponent],
      imports: [MatTableModule, MatSortModule, NoopAnimationsModule],
      providers: [
        { provide: LaunchStateService, useValue: mockLaunchStateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LaunchesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchLaunches on init', () => {
    fixture.detectChanges(); // triggers ngOnInit
    expect(mockLaunchStateService.fetchLaunches).toHaveBeenCalledTimes(1);
  });

  it('should populate dataSource when launches$ emits', () => {
    fixture.detectChanges();
    launchesSubject.next(MOCK_LAUNCHES);
    expect(component.dataSource.data).toEqual(MOCK_LAUNCHES);
  });

  it('should set the sort on the dataSource after view init', () => {
    // Manually trigger ngAfterViewInit
    component.ngAfterViewInit();
    expect(component.dataSource.sort).toBe(component.sort);
  });
});
