import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongodbURI = process.env.MONGODB_URL;
    const projectName = "resume_builder";

    if (!mongodbURI) {
      throw new Error("MongoDB connection string is not defined in environment variables");
    }

    let connectionString = mongodbURI;
    if (mongodbURI.endsWith("/")) {
      connectionString = mongodbURI.slice(0, -1);
    }

    const conn = await mongoose.connect(`${connectionString}/${projectName}`);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
