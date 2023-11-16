require('dotenv').config();

const express = require('express');
const dbConnect = require('./config/dbConnect');

const app = express();
const port = process.env.PORT || 5000;

const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRouter = require('./routes/authController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();

app.use('/api/v1/auth', authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});