import winston from 'winston';
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'Facebook logging' },
    transports: [new winston.transports.File({ filename: "log.txt" })],
});
const loggerMiddleware = (req, res, next) => {
    if (!(req.url === "/api/users/signUp" || req.url === "/api/users/signin")) {
        const originalJson = res.json;

        res.json = function (body) {
            const now = new Date();
            const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
            // this is the way to apply ternary operator and handle object data in response
            const status = body?.status !== undefined ? body.status : "Unknown";
            const logData = `${timestamp} - ${req.method} ${req.url} - Response: Posts:"${status}"`;

            logger.info(logData);

            return originalJson.call(this, body);
        };

    }
    next();
}
export default loggerMiddleware;