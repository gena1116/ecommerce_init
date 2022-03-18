require('dotenv').config();
const models = require('./models/models')
const express = require('express');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')
const sequelize = require('./db_config/db');
const router = require('./routes/index')
const ErrorHandler = require('./middleware/ErrorHandlingMiddleware')


const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')))

app.use('/api', router)

app.use(ErrorHandler)

const start = async () => {
    try {
        sequelize.authenticate();
        sequelize.sync();
        app.listen(PORT, () =>
            console.log(`Server started on port == ${PORT}`)
        );
    } catch (error) {
        console.log(error);
    }
};

start()
