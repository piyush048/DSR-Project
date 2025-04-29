import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../utils';
import { ErrorMessages, errorResponse, HTTP_CODES } from '../common';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      logger.error('Validation error', error.details);
      errorResponse(res, HTTP_CODES.BAD_REQUEST, ErrorMessages.VALIDATION_ERROR, error.details.map((detail) => detail.message));
      return;
    }

    next();
  };
};
