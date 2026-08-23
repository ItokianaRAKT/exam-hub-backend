declare global {
  namespace Express {
    interface Request {
      user?: import("./authTypes").JwtPayload;
    }
  }
}

export {};
