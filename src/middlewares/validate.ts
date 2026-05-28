import type { Request, Response, NextFunction } from "express";
import z, { type ZodType } from "zod";

const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json(z.treeifyError(result.error));
      return;
    }

    req.body = result.data;
    next();
  };

export default validate;
