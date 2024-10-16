import { ApiException } from "./api.exception"

export class BadRequestException extends ApiException {
  constructor(message: string, status?: number) {
    super(message, status ?? 400);
  }
}