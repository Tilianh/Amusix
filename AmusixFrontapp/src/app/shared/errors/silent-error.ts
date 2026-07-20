/** Error that will not be notified in the application interface. */
export class SilentError extends Error {
  constructor(innerException: Error) {
    super();
    super.cause = innerException.cause;
    super.message = innerException.message;
    super.name = innerException.name;
  }
}
