import { History } from 'history';

export const handleJWTError = (
  history: History,
  errorHandler: (err: string) => any
) => {
  return (_err: string) => {
    if (_err === 'jwt expired') {
      history.push('/login');
    } else {
      errorHandler(_err);
    }
  };
};
