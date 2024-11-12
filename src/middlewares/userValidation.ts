import {body} from "express-validator";
import {STATUS_MESSAGES} from "../consts"

export const userNameValidator = body('name')
    .notEmpty().withMessage(STATUS_MESSAGES.REQUIRED_NAME)
    .isLength({ min: 3 }).withMessage(STATUS_MESSAGES.MIN_LENGTH_3);

export const userEmailValidator = body('email')
    .notEmpty().withMessage(STATUS_MESSAGES.REQUIRED_EMAIL)
    .isEmail().withMessage(STATUS_MESSAGES.INVALID_EMAIL)