export default class ErrorMiddleware extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
    static globalErrorHandler = (err, req, res, next) => {
        if (res.headerSent) {
            return next(err);
        }
        res.status(err.statusCode || 500).json({
            message: err.message,
            statusCode: err.statusCode,
        });
    }
}