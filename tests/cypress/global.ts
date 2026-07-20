declare namespace Cypress {
  interface Chainable {
    /**
     * Check if a route can't be accessed without an access token.
     * @param url Route URL.
     * @param method Request method.
     */
    checkPrivateRoute(url: string, method: string): void;

    /**
     * Try to log into the backend application.
     * If the authentication succeed, the returned access token will be saved in a cookie.
     * @param username
     * @param password
     */
    login(username: string, password: string): void;

    /**
     * Try to send a request to the API using the saved access token.
     * @param url Route URL.
     * @param method Request method.
     * @param body Optional object to send.
     * @returns A {@link Chainable} of the returned {@link Response}.
     */
    tryRequest(url: string, method: string, body?: any): Chainable<Response<any>>;
  }
}
