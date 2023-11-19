require('dotenv').config();

const express = require('express');
const dbConnect = require('./config/dbConnect');

const app = express();
const port = process.env.PORT || 5000;

const cookieParser = require('cookie-parser');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

dbConnect();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});