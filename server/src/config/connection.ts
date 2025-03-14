import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';
console.log("MONGODB_URI:", MONGODB_URI)

const connectDB = async (): Promise<typeof mongoose.connection> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to the database');
        return mongoose.connection;
    } catch (error) {
        console.error('Error connecting to the database: ', error);
        throw new Error('Error connecting to the database');
    }
}

export default connectDB;
