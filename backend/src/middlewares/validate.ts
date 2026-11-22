import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { AppError } from "./errorHandler";

const KNOWN_CODES = ["TITLE_REQUIRED", "TITLE_TOO_LONG", "INVALID_INPUT"];

export const validate = (
  schema: ZodType,
  target: "body" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const input = target === "body" ? (req.body ?? {}) : req.params;
    const result = schema.safeParse(input);

    if (!result.success) {
      const code = result.error.issues[0]?.message;
      return next(
        new AppError(400, KNOWN_CODES.includes(code) ? code : "INVALID_INPUT"),
      );
    }

    if (target === "body") {
      req.body = result.data;
    }
    next();
  };
};
