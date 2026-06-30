export class HttpError extends Error {
  constructor(
    readonly statusCode: number,
    readonly publicMessage: string
  ) {
    super(publicMessage);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
