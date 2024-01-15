"use strict";
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");
class ErrorResponse extends Error {
    //kết thứa message và status của ER trong nodeJs
    constructor(message, status) {
        super(message);
        // truyền message vào Err của NODEJS
        this.status = status;
    }
}
class conflictRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.CONFLICT,
        statusCode = StatusCodes.FORBIDDEN
    ) {
        super(message, statusCode);
    }
}
class badRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.CONFLICT,
        statusCode = StatusCodes.FORBIDDEN
    ) {
        super(message, statusCode);
    }
}
class AuthFailureError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.UNAUTHORIZED,
        statusCode = StatusCodes.UNAUTHORIZED
    ) {
        super(message, statusCode);
    }
}
class NotFoundError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.NOT_FOUND,
        statusCode = StatusCodes.NOT_FOUND
    ) {
        super(message, statusCode);
    }
}
module.exports = {
    conflictRequestError,
    badRequestError,
    AuthFailureError,
    NotFoundError,
};
