import { ChangeDetectionStrategy, Component, OnInit, effect, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { Launch } from '../../core/models/launch.model';
import { LaunchStateService } from '../../services/launch-state.service';

export type LaunchColumn = 'mission_name' | 'launch_year' | 'rocket_name' | 'launch_site';

/** Maps a (possibly nested) column to the value the table sorts by. */
export function launchSortValue(launch: Launch, column: string): string | number {
  switch (column as LaunchColumn) {
    case 'rocket_name':
      return launch.rocket?.rocket_name ?? '';
    case 'launch_site':
      return launch.launch_site?.site_name_long ?? '';
    case 'launch_year':
      return Number(launch.launch_year) || 0;
    case 'mission_name':
      return launch.mission_name ?? '';
    default:
      return '';
  }
}

@Component({
  selector: 'app-launches',
  imports: [MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './launches-component.component.html',
  styleUrls: ['./launches-component.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchesComponent implements OnInit {
  private readonly launchState = inject(LaunchStateService);

  readonly loading = this.launchState.loading;
  readonly hasError = this.launchState.hasError;
  readonly launches = this.launchState.launches;

  readonly displayedColumns: LaunchColumn[] = ['mission_name', 'launch_year', 'rocket_name', 'launch_site'];
  readonly dataSource = new MatTableDataSource<Launch>([]);

  // The table lives inside an @if block, so sort/paginator only exist once data is shown.
  private readonly sort = viewChild(MatSort);
  private readonly paginator = viewChild(MatPaginator);

  constructor() {
    this.dataSource.sortingDataAccessor = launchSortValue;

    effect(() => {
      this.dataSource.data = this.launches();
    });
    effect(() => {
      this.dataSource.sort = this.sort() ?? null;
      this.dataSource.paginator = this.paginator() ?? null;
    });
  }

  ngOnInit(): void {
    this.launchState.fetchLaunches();
  }

  retry(): void {
    this.launchState.fetchLaunches();
  }
}
