export class ApiException extends Error {
  private status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);

    if (status) this.setStatus(status);
  }

  setStatus(status: number) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }
}