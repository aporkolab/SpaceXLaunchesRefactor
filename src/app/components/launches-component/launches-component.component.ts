import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Launch } from 'src/app/core/models/launch.model';
import { LaunchStateService } from 'src/app/services/launch-state.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-launches',
  templateUrl: './launches-component.component.html',
  styleUrls: ['./launches-component.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LaunchesComponent implements OnInit, AfterViewInit {
  loading$: Observable<boolean>;
  error$: Observable<any>;

  displayedColumns: string[] = [
    'mission_name',
    'launch_year',
    'rocket_name',
    'launch_site',
  ];
  dataSource = new MatTableDataSource<Launch>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private launchStateService: LaunchStateService) {
    this.loading$ = this.launchStateService.loading$;
    this.error$ = this.launchStateService.error$;
  }

  ngOnInit() {
    this.launchStateService.launches$.subscribe((launches) => {
      this.dataSource.data = launches;
    });
    this.launchStateService.fetchLaunches();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
