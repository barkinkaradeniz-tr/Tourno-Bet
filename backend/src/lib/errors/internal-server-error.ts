import ExtendableError from "./extendable-error";

class InternalServerError extends ExtendableError {
  constructor(message?: string) {
    super(message || "Internal server error", { statusCode: 500 });
  }
}

export default InternalServerError;
