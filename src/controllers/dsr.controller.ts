import { Request, Response } from 'express';
import * as dsrService from '../services';
import { User } from '../models';
import { logger } from '../utils';
import { ErrorMessages, errorResponse, HTTP_CODES, SuccessMessages, successResponse } from '../common';

export const createDsr = async (req: Request & { user?: User }, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, HTTP_CODES.UNAUTHORIZED, ErrorMessages.USER_NOT_FOUND);
      logger.error('User not found in createDsr');
      return;
    }
    const userId = req.user.id;
    const { content, hours, date } = req.body;
    const dsr = await dsrService.addDsr({ userId, content, date, hours, project: 'DSR System' });
    successResponse(res, HTTP_CODES.CREATED, SuccessMessages.DSR_CREATED, dsr);
  } catch (error: any) {
    logger.error('Error creating DSR:', error);
    errorResponse(res, HTTP_CODES.BAD_REQUEST, ErrorMessages.INTERNAL_ERROR, error.message);
  }
};

export const updateDsr = async (req: Request & { user?: User }, res: Response): Promise<void> => {
  if (!req.user) {
    errorResponse(res, HTTP_CODES.UNAUTHORIZED, ErrorMessages.USER_NOT_FOUND);
    logger.error('User not found in updateDsr');
    return;
  }
  const userId = req.user.id;
  const {id, content, hours } = req.body;

  try {
    const updated = await dsrService.updateDsr(id, userId, { content, hours });
    if (!updated) {
      errorResponse(res, HTTP_CODES.NOT_FOUND, ErrorMessages.DSR_NOT_FOUND);
      logger.error('DSR not found in updateDsr');
      return;
    }

    successResponse(res, HTTP_CODES.OK, SuccessMessages.DSR_UPDATED, updated);
  } catch (error: any) {
    errorResponse(res, HTTP_CODES.BAD_REQUEST, ErrorMessages.INTERNAL_ERROR, error.message);
    logger.error('Error updating DSR:', error);
    return;
  }
};

export const getDsrs = async (req: Request & { user?: User }, res: Response) => {
  if (!req.user) {
    errorResponse(res, HTTP_CODES.UNAUTHORIZED, ErrorMessages.USER_NOT_FOUND);
    logger.error('User not found in getDsrs');
    return;
  }

  try {
    const userId = req.user.id;
    const { startDate, endDate, page = 1, limit = 10 } = req.query as any;

    const { dsrs, total } = await dsrService.getDsrs(userId, startDate, endDate, +page, +limit);
    successResponse(res, HTTP_CODES.OK, SuccessMessages.DSR_FETCHED, { dsrs, total });
  } catch (error: any) {
    logger.error('Error fetching DSrs:', error);
    errorResponse(res, HTTP_CODES.BAD_REQUEST, ErrorMessages.INTERNAL_ERROR, error.message);
  }
};

export const getDsrById = async (req: Request & { user?: User }, res: Response) => {
  if (!req.user) {
    errorResponse(res, HTTP_CODES.UNAUTHORIZED, ErrorMessages.USER_NOT_FOUND);
    logger.error('User not found in getDsrById');
    return;
  }
  try {
    const userId = req.user.id;
    const dsrId = Number(req.params.dsrId);
    const dsr = await dsrService.getDsrById(dsrId, userId);
    if (!dsr) {
      errorResponse(res, HTTP_CODES.NOT_FOUND, ErrorMessages.DSR_NOT_FOUND);
      logger.error('DSR not found for id:', dsrId);
      return;
    }

    successResponse(res, HTTP_CODES.OK, SuccessMessages.DSR_FETCHED, { dsr });
  } catch (error: any) {
    logger.error('Error fetching DSR by id:', error);
    errorResponse(res, HTTP_CODES.BAD_REQUEST, ErrorMessages.INTERNAL_ERROR, error.message);
  }
};
