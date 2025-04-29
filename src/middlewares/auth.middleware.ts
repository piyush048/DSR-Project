import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models';
import { logger } from '../utils';
import { ErrorMessages, errorResponse, HTTP_CODES } from '../common';

interface AuthenticatedRequest extends Request {
  user?: User;
}

interface DecodedToken extends JwtPayload {
  id: number;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.error('Not authorized, no token provided');
    errorResponse(res, HTTP_CODES.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    const user = await User.findByPk(decoded.id);
    if (!user) {
      logger.error('Not authorized, user not found');
      errorResponse(res, HTTP_CODES.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Not authorized, token failed', error);
    errorResponse(res, HTTP_CODES.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    return;
  }
};
