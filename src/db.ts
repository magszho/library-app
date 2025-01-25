import mongoose, { ConnectOptions } from 'mongoose';

const mongoURL: string = "mongodb://127.0.0.1/my_database";
mongoose.connect(mongoURL, {
    useNewUrlParser: true
} as ConnectOptions).then(() => {
    console.log("Database connected");
}).catch((error) => {
    console.error.bind(console, "Database error:" + error);
});
mongoose.Promise = global.Promise;

export const db = mongoose.connection;