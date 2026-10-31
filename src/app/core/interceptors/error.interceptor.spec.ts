import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';

import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([errorInterceptor])), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('logs and re-throws HTTP errors', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let received: HttpErrorResponse | undefined;

    httpClient.get('/test').subscribe({
      next: () => expect.fail('request should have failed'),
      error: (error: HttpErrorResponse) => (received = error),
    });
    httpMock.expectOne('/test').flush(null, { status: 404, statusText: 'Not Found' });

    expect(received?.status).toBe(404);
    expect(consoleError).toHaveBeenCalledWith('HTTP Error caught by Interceptor:', received);
  });

  it('passes successful responses through without logging', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let body: unknown;

    httpClient.get('/ok').subscribe((value) => (body = value));
    httpMock.expectOne('/ok').flush({ ok: true });

    expect(body).toEqual({ ok: true });
    expect(consoleError).not.toHaveBeenCalled();
  });
});
