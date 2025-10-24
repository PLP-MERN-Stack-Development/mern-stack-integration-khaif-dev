class AppError extends Error{
    constructor(message, statuscode){
        super(message);
        this.statuscode = statuscode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError{
    constructor(message = 'Resource Not Found'){
        super(message, 404);
    }
};

class ValidationError extends AppError {
    constructor(message = 'Invalid data'){
        super(message, 400);
    }
};

module.exports = { AppError, NotFoundError, ValidationError};