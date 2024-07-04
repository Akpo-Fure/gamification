import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.DATABASE_URI as string);
    // console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to the database: ${error}`);
    process.exit(1);
  }
};
