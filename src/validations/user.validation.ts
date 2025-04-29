import Joi from 'joi';

export const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).messages({
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have at least 6 characters',
    'string.max': 'Password should not exceed 30 characters',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  }),
  profilePicture: Joi.string().uri().optional().allow('', null)
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  profilePicture: Joi.string().uri().optional().allow('', null)
});


export const emailSchema = Joi.object({
  email: Joi.string().email().required()
});

export const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required()
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).messages({
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password should have at least 6 characters',
    'string.max': 'Password should not exceed 30 characters',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
});

