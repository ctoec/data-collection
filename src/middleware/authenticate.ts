import { Request } from 'express';
import jwt, {
  JwtHeader,
  SigningKeyCallback,
  VerifyCallback,
} from 'jsonwebtoken';
import jwks from 'jwks-rsa';
import { UserService } from '../services/user/UserService';

const jwksClient = jwks({
  // @TODO Use ENV var for URI host
  jwksUri: 'https://winged-keys:5050/.well-known/openid-configuration/jwks',
  // @TODO Add HTTPS support
  strictSsl: false,
});

const getAuthorizationToken = (req: Request) => {
  const authorizationHeader = req.header('Authorization');
  if (!authorizationHeader) {
    throw new Error('No Authorization header');
  }
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const token = authorizationHeader.substr(7);
    return token;
  } else {
    throw new Error('Invalid Authorization header for Bearer Auth');
  }
};

const getJwtSecret = (header: JwtHeader, cb: SigningKeyCallback) => {
  jwksClient.getSigningKey(header.kid, function (err, key) {
    if (err) {
      cb(err, null);
      return;
    }
    var signingKey = key.getPublicKey();
    cb(null, signingKey);
  });
};

const validate = (token: string, cb: VerifyCallback) => {
  jwt.verify(
    token,
    getJwtSecret,
    {
      algorithms: ['RS256'],
    },
    cb
  );
};

export function expressAuthentication(
  req: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName !== 'jwt') {
    throw new Error('Invalid security scheme');
  }

  const token = getAuthorizationToken(req);

  return new Promise((resolve, reject) => {
    validate(token, (err, decodedToken: any) => {
      if (err) {
        reject(err);
        return;
      }
      const user = new UserService().getByWingedKeysId(decodedToken.sub);
      resolve(user);
    });
  });
}
