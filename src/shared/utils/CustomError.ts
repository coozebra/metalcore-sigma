export class CustomError extends Error {
  cause: any;

  constructor(cause, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = 'CustomError';
    this.cause = cause;
  }
}
