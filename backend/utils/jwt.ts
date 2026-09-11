import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  name?: string;
}

/**
 * Generate a signed JWT token
 */
export const signToken = (payload: JwtPayload, expiresIn: string = config.jwt.expiresIn): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  });
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};
