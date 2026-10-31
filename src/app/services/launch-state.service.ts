import { Injectable, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { Launch } from '../core/models/launch.model';
import { GraphqlService } from './graphql.service';

/**
 * Single source of truth for the launch list. State is exposed as read-only
 * signals; only this service mutates it.
 */
@Injectable({
  providedIn: 'root',
})
export class LaunchStateService {
  private readonly graphqlService = inject(GraphqlService);

  private readonly _launches = signal<Launch[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<unknown>(null);

  readonly launches = this._launches.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasError = computed(() => this._error() !== null);

  private request?: Subscription;

  /** Loads launches; a new call cancels a still running previous request. */
  fetchLaunches(): void {
    this.request?.unsubscribe();
    this._loading.set(true);
    this._error.set(null);

    this.request = this.graphqlService.getLaunches().subscribe({
      next: (launches) => {
        this._launches.set(launches);
        this._loading.set(false);
      },
      error: (error: unknown) => {
        this._error.set(error ?? new Error('Unknown error'));
        this._loading.set(false);
      },
    });
  }
}
