import mongoose, { ConnectOptions } from 'mongoose';

if (!process.env.MONGODB_USER || !process.env.MONGODB_PASSWORD) {
  const error = "MongoDB credentials are missing! Please check your environment variables for MONGODB_USER and MONGODB_PASSWORD";
  console.error(error);
  throw new Error(error);
}

// const mongoURL: string = "mongodb://127.0.0.1/my_database";
const mongoURL = "mongodb+srv://" + process.env.MONGODB_USER + ":" + process.env.MONGODB_PASSWORD + "@cluster0.ff7jt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose.connect(mongoURL, clientOptions as ConnectOptions).then(() => {
    console.log("Database connected");
}).catch((error) => {
    console.error("Database connection error:", error);
});

export const db = mongoose.connection;