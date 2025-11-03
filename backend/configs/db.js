import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongodbURI = process.env.MONGODB_URL || process.env.MONGODB_URI;
    const projectName = "resume_builder";

    if (!mongodbURI) {
      throw new Error("MongoDB connection string is not defined in environment variables");
    }

    let connectionString = mongodbURI;
    if (mongodbURI.endsWith("/")) {
      connectionString = mongodbURI.slice(0, -1);
    }

    // Connection options for better performance and scalability
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    };

    const conn = await mongoose.connect(`${connectionString}/${projectName}`, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
