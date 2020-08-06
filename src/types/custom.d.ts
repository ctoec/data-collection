declare namespace Express {
  export interface Request {
    user: import('../entity').User;
    claims: { sub: string };
  }
}
