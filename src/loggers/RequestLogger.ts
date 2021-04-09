import morgan from 'morgan';
import { Request } from 'express';

morgan.token('userId', function (req) {
  return `${(req as Request).user?.id}`;
});
// Apache standard a la https://github.com/expressjs/morgan#common
// But with userId instead of :remote-user (because we don't do basic auth, that will never be useful info)
// Also, only log requests for the backend services (at /api), not the requests for the static UI content
export const requestLogger = morgan(
  ':remote-addr - :userId [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]',
  { skip: (req) => !(req as Request).baseUrl?.includes('api') }
);
