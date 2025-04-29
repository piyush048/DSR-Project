import { Request, Response } from 'express';
import {
  signupService,
  loginService,
  getProfileService,
  updateProfileService,
  sendOtpToUser,
  verifyUserOtp
} from '../services';
import { User } from '../models';
import { logger } from '../utils';
import { errorResponse, successResponse, HTTP_CODES, ErrorMessages, SuccessMessages } from '../common';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await signupService(req.body);
    successResponse(res, HTTP_CODES.CREATED, SuccessMessages.REGISTERED, { user: data.user, token: data.token });
  } catch (err: any) {
    logger.error('Error during signup:', err);
    errorResponse(res, HTTP_CODES.BAD_REQUEST, ErrorMessages.USER_EXISTS, err.message);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = await loginService(req.body);
    successResponse(res, HTTP_CODES.OK, SuccessMessages.LOGGED_IN, { token });
  } catch (err: any) {
    logger.error('Error during login:', err);
    errorResponse(res, HTTP_CODES.UNAUTHORIZED, ErrorMessages.INVALID_CREDENTIALS, err.message);
  }
};

export const getProfile = async (req: Request & { user?: User }, res: Response): Promise<void> => {
  if (!req.user){
    errorResponse(res, HTTP_CODES.UNAUTHORIZED, ErrorMessages.USER_NOT_FOUND);
    logger.error('Error fetching profile: User not found');
    return;
  }
  
  const profile = await getProfileService(req.user);
  successResponse(res, HTTP_CODES.OK, SuccessMessages.PROFILE_FETCHED, profile);
};

export const updateProfile = async (req: Request & { user?: User }, res: Response ): Promise<void> => {
  if (!req.user){
    errorResponse(res, HTTP_CODES.UNAUTHORIZED, ErrorMessages.USER_NOT_FOUND);
    logger.error('Error updating profile: User not found');
    return;
  }
  const updated = await updateProfileService(req.user, req.body);
  successResponse(res, HTTP_CODES.OK, SuccessMessages.PROFILE_UPDATED, updated);
};


export const forgetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const otp = await sendOtpToUser(email);
    successResponse(res, HTTP_CODES.OK, SuccessMessages.OTP_SENT, { OTP: otp });
  } catch (err: any) {
    logger.error('Error sending OTP:', err);
    errorResponse(res, HTTP_CODES.BAD_REQUEST, err.message);
  }
};

// For resend OTP
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const otp = await sendOtpToUser(email);
    successResponse(res, HTTP_CODES.OK, SuccessMessages.OTP_RESENT, { OTP: otp });
  } catch (err: any) {
    logger.error('Error resending OTP:', err);
    errorResponse(res, HTTP_CODES.BAD_REQUEST, err.message);
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, newPassword } = req.body;
  try {
    const isValid = await verifyUserOtp(email, otp, newPassword);
    if (!isValid) {
      logger.error('Invalid or expired OTP');
      errorResponse(res, HTTP_CODES.BAD_REQUEST, ErrorMessages.INVALID_OTP);
      return;
    }
    successResponse(res, HTTP_CODES.OK, SuccessMessages.OTP_VERIFIED, { message: 'Password updated successfully' });
  } catch (err: any) {
    logger.error('Error verifying OTP:', err);
    errorResponse(res, HTTP_CODES.BAD_REQUEST, err.message);
  }
};