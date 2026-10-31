import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { GqlResponse, Launch } from '../core/models/launch.model';

export const LAUNCHES_QUERY = `
  query Launches($limit: Int, $offset: Int) {
    launches(find: {}, limit: $limit, offset: $offset, order: "asc", sort: "launch_date_utc") {
      details
      id
      is_tentative
      launch_date_local
      launch_date_unix
      launch_date_utc
      launch_site {
        site_id
        site_name
        site_name_long
      }
      launch_success
      launch_year
      links {
        article_link
        video_link
        mission_patch
      }
      mission_id
      mission_name
      rocket {
        rocket_name
        rocket_type
      }
      static_fire_date_unix
      static_fire_date_utc
      telemetry {
        flight_club
      }
      tentative_max_precision
      upcoming
    }
  }
`;

/** Raised when the GraphQL API answers with HTTP 200 but reports errors or no data. */
export class GraphqlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GraphqlError';
  }
}

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getLaunches(limit = 10, offset = 0): Observable<Launch[]> {
    return this.http
      .post<GqlResponse>(this.apiUrl, { query: LAUNCHES_QUERY, variables: { limit, offset } })
      .pipe(
        map((response) => {
          if (response.errors?.length) {
            throw new GraphqlError(response.errors.map((e) => e.message).join('; '));
          }
          const launches = response.data?.launches;
          if (!launches) {
            throw new GraphqlError('GraphQL response did not contain any launch data.');
          }
          return launches;
        }),
      );
  }
}
