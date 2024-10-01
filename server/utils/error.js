class customError extends Error {
    constructor(message, statusCode,at) {
        super();
        this.at = at
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = customError;