export interface SuccessResponseConstructor {
  message?: string;
}

export class SuccessResponse {
  message: string;

  constructor({ message = "Success" }: SuccessResponseConstructor) {
    this.message = message;
  }
}
