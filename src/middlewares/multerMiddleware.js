import multer from "multer";
import ErrorMiddleware from "./errorMiddleware.js";
import path from "path";
import fs from "fs";
const location = path.join(process.cwd(), "src", "public", "uploads");
if (!fs.existsSync(location)) {
    fs.mkdirSync(location, { recursive: true });
}
const storage = multer.diskStorage({
    destination: location,
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});
const fileFilter = (req, file, cb) => {
    try {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            cb(new ErrorMiddleware("Only images are allowed!"), false);
        }
    } catch (error) {
        cb(error, false);
    }
};
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
})
export default upload;