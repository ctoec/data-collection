import { Request } from 'express';

export const parseQS = <T = string>(
  req: Request,
  name: string,
  opts?: { post?: (_: string) => T; forceArray?: boolean }
) => {
  opts = opts || {};
  const values = req.query[name];

  if (Array.isArray(values)) {
    if (opts.post) {
      return (values as string[]).map((v) => opts.post(v));
    }

    return (values as any[]) as T[];
  }

  let value: T;
  if (opts.post && values) {
    value = opts.post(values as string);
  }

  return opts.forceArray ? (value ? [value] : []) : value;
};
