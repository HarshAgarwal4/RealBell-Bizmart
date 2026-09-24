import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { isLoggedIn } from './middlewares/Auth.js';
import { userRoutes } from './App/routes/user.js';
import { productRoutes } from './App/routes/product.js';
import { orderPaymentRoutes } from './App/routes/orderPayment.js';

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(isLoggedIn);

app.get('/', (req, res) => {
    res.send({ status: 1, msg: "RealBell BizMart API is operational" });
});

// Mount Routes
app.use('/', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderPaymentRoutes);
// Also mount at root for backward compatibility
app.use('/', productRoutes);
app.use('/', orderPaymentRoutes);

const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/RBF";

mongoose.connect(DB_URL, {
    dbName: "BizMart"
}).then(() => {
    console.log("Connected to MongoDB Atlas / Local BizMart");
    app.listen(PORT, () => {
        console.log("RealBell BizMart Server is running on port", PORT);
    });
}).catch(err => {
    console.error("Database connection error:", err.message);
});