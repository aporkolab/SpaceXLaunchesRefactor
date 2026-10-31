import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    consoleErrorSpy = spyOn(console, 'error').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should catch and log an error', () => {
    const testUrl = '/test';
    const mockError = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
    });

    httpClient.get(testUrl).subscribe({
      next: () => fail('should have failed with a 404 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
      },
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(null, mockError);

    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
