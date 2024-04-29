import ExtendableError from "./extendable-error";

export const ExtentableErrorExpressHandler = () => {
  return (error: any, req: Express.Request, res: any, next: any) => {
    if (error instanceof ExtendableError) {
      return res.status(error.statusCode).json(error);
    }
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return next(error);
  };
};

export { default as ExtendableError } from "./extendable-error";
export { default as InternalServerError } from "./internal-server-error";
export { default as UnauthorizedRequestError } from "./unauthorized-request-error";
export { default as BadRequestError } from "./bad-request-error";
export { default as NotFoundError } from "./not-found-error";
