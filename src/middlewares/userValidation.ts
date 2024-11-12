import {body} from "express-validator";

export const userNameValidator = body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Min length is 3 symbols');

export const userEmailValidator = body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('This is not a valid email address')