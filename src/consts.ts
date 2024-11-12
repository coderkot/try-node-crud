export enum HTTP_STATUS {
    OK_200 = 200,
    NOT_FOUND_404 = 404,
    BAD_REQUEST_400 = 400,
    UNAUTHORIZED_401 = 401,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,
}

export enum STATUS_MESSAGES {
    EMPTY_DATA = 'Name or email cannot be empty',
    BODY_EMPTY_NAME = 'Name cannot be empty',
    WELCOME = 'Welcome to the server',
    REQUIRED_NAME = 'Name is required',
    REQUIRED_EMAIL = 'Email is required',
    MIN_LENGTH_3 = 'Min length is 3 symbols',
    INVALID_EMAIL = 'This is not a valid email address'
}