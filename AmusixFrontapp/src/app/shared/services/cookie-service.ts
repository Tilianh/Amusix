import { Injectable } from '@angular/core';
import Cookies from 'universal-cookie';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  private readonly cookies = new Cookies(null, { path: '/' });

  /**
   * Get a cookie from its key.
   * @param key Key of the cookie to get.
   * @returns Corresponding cookie value if found, else `undefined`.
   */
  public getCookie<T>(key: string): T | undefined {
    const cookie = this.cookies.get(key);
    return cookie ? cookie as T : undefined;
  }

  /**
   * Set the value of a cookie.
   * @param key Cookie key.
   * @param value Cookie value.
   */
  public setCookie<T>(key: string, value: T) {
    this.cookies.set(key, value);
  }

  /**
   * Remove a cookie.
   * @param key Key of the cookie to remove.
   * @returns Removed cookie value.
   */
  public removeCookie<T>(key: string): T | undefined {
    const cookie = this.getCookie<T>(key);
    this.cookies.remove(key);
    return cookie;
  }
}
