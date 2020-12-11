import { Request } from 'express';

export const parseQueryString = <T = string>(
  req: Request,
  name: string,
  opts?: { post?: (_: any) => T; forceArray?: boolean }
) => {
  const { post, forceArray } = opts || {};
  const values = req.query[name];

  if (Array.isArray(values)) {
    if (post) {
      return (values as string[]).map((v) => post(v));
    }
    return (values as any[]) as T[];
  }

  let value: T;
  if (post && values) {
    value = post(values);
  } else {
    value = (values as any) as T;
  }

  if (forceArray) {
    return (value ? [value] : undefined) as T[];
  }
  return value;
};
