import { inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Constants } from '../constants';
import { Router } from '@angular/router';
import { AmxComponentBase } from '../components/amx-component-base';
import { SilentError } from '../errors/silent-error';
import { CookieService } from './cookie-service';

/** Amusix service base. */
export abstract class AmxServiceBase extends AmxComponentBase {
  //region fields

  protected readonly http = inject(HttpClient);
  protected readonly cookieService = inject(CookieService);
  protected readonly router = inject(Router);

  /** Service API URL. */
  protected abstract readonly apiUrl: string;

  //endregion

  //region methods

  /**
   * Try to fetch data from a URL based on the current user's accesses.
   * @param url Source URL.
   * @returns The fetched data.
   */
  protected tryGetAsync<TOut>(url: string) {
    return this.executeRequestAsync<undefined, TOut>(RequestType.GET, url);
  }

  /**
   * Try to post data to a URL based on the current user's accesses.
   * @param url Destination URL.
   * @param args Request body (args).
   * @returns Return value.
   */
  protected tryPostAsync<TIn, TOut>(url: string, args: TIn) {
    return this.executeRequestAsync<TIn, TOut>(RequestType.POST, url, args);
  }

  /**
   * Try to put data to a URL based on the current user's accesses.
   * @param url Destination URL.
   * @param args Request body (args).
   * @returns Return value.
   */
  protected tryPutAsync<TIn, TOut>(url: string, args: TIn) {
    return this.executeRequestAsync<TIn, TOut>(RequestType.PUT, url, args);
  }

  /**
   * Try to delete data corresponding to a URL based on the current user's accesses.
   * @param url Delete URL.
   * @returns Return value.
   */
  protected tryDeleteAsync<TOut>(url: string) {
    return this.executeRequestAsync<undefined, TOut>(RequestType.DELETE, url);
  }

  /**
   * Execute an HTTP request.
   * Redirect to the authentication form if the request is not permitted.
   * @param requestType Request type.
   * @param url Request URL.
   * @param args Request body (args).
   * @returns Return value.
   */
  private async executeRequestAsync<TIn, TOut>(
    requestType: RequestType,
    url: string,
    args?: TIn
  ): Promise<TOut | undefined> {
    const token = this.cookieService.getCookie<string>(Constants.ACCESS_TOKEN_COOKIE_KEY);
    const options = {
      headers: new HttpHeaders(token ? {Authorization: `Bearer ${token}`} : undefined)
    };
    try {
      switch (requestType) {
        case RequestType.GET:
          return await firstValueFrom(this.http.get<TOut>(url, options));
        case RequestType.POST:
          return await firstValueFrom(this.http.post<TOut>(url, args, options));
        case RequestType.PUT:
          return await firstValueFrom(this.http.put<TOut>(url, args, options));
        case RequestType.DELETE:
          return await firstValueFrom(this.http.delete<TOut>(url, options));
      }
    } catch (e) {
      if (e instanceof HttpErrorResponse && e.status == 401) {
        await this.router.navigateByUrl(`/login?returnUrl=${location.href}`);
        throw new SilentError(e);
      }
      throw e;
    }
  }

  //endregion
}

enum RequestType {
  GET,
  POST,
  PUT,
  DELETE,
}
