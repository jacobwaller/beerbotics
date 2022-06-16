import Joi from 'joi';

export const IndexValidator = Joi.number().integer().min(0);
export const UuidValidator = Joi.string().uuid({ version: 'uuidv4' });
