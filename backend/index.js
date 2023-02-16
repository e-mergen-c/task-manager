import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import allRoutes from './routes/index.js';
import path from "path";

const PORT = process.env.PORT || 8000;
const app = express();

//middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/api', allRoutes);

// --------------------------deployment------------------------------
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    );
    } else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}
// --------------------------deployment------------------------------

//error handlers
app.use((err, req, res, next) => {
    console.log({err});
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(status).json({message, stack: err.stack});
})

const connectDB = async ()=> {
    try{
        const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log(`mongodb connected: ${conn.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};


app.listen(PORT, ()=>{
    connectDB();
    console.log(`server is running on port ${PORT}`);
});