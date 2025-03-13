import ErrorMiddleware from "../middlewares/errorMiddleware"
export default class Authentication {

    async registerUser(req, res, next) {
        try {
            const { name, email, password, gender } = req.body;
            if (!name || !email || !password || !gender) {
                throw new ErrorMiddleware("All fields are required", 400);
            }

            res.send("register user");
        } catch (error) {
            next(error);
        }
    }
}