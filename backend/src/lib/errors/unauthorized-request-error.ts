import ExtendableError from "./extendable-error";

class UnauthorizedRequestError extends ExtendableError {
  constructor(message?: string) {
    super(message || "Unauthorized request", { statusCode: 401 });
  }
}

export default UnauthorizedRequestError;
