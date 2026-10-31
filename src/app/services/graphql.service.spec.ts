import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Launch } from '../core/models/launch.model';
import { makeLaunch } from '../../testing/launch.fixtures';
import { GraphqlError, GraphqlService, LAUNCHES_QUERY } from './graphql.service';

describe('GraphqlService', () => {
  let service: GraphqlService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GraphqlService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('POSTs the launches query with paging variables to the GraphQL endpoint', () => {
    service.getLaunches(20, 40).subscribe();

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ query: LAUNCHES_QUERY, variables: { limit: 20, offset: 40 } });
    req.flush({ data: { launches: [] } });
  });

  it('defaults to the first 10 launches', () => {
    service.getLaunches().subscribe();

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.body.variables).toEqual({ limit: 10, offset: 0 });
    req.flush({ data: { launches: [] } });
  });

  it('unwraps the launches from the response', () => {
    const launches = [makeLaunch(), makeLaunch({ id: '2', mission_name: 'DemoSat' })];
    let result: Launch[] | undefined;

    service.getLaunches().subscribe((value) => (result = value));
    httpMock.expectOne(environment.apiUrl).flush({ data: { launches } });

    expect(result).toEqual(launches);
  });

  it('errors when the API reports GraphQL errors', () => {
    let error: unknown;

    service.getLaunches().subscribe({ error: (e: unknown) => (error = e) });
    httpMock.expectOne(environment.apiUrl).flush({
      data: { launches: null },
      errors: [{ message: 'upstream failed' }, { message: 'second' }],
    });

    expect(error).toBeInstanceOf(GraphqlError);
    expect((error as GraphqlError).message).toBe('upstream failed; second');
  });

  it('errors when the response contains no launch data', () => {
    let error: unknown;

    service.getLaunches().subscribe({ error: (e: unknown) => (error = e) });
    httpMock.expectOne(environment.apiUrl).flush({ data: null });

    expect(error).toBeInstanceOf(GraphqlError);
  });
});
