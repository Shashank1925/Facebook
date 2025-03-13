import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const url = process.env.MONGODB__URI;
const connectToDb = async () => {
    try {
        await mongoose.connect(url);
        console.log('MongoDB connected using mongoose');
    }
    catch (err) {
        console.log(err);
    }
};
export default connectToDb;