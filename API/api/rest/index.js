const express = require('express')
const app = express();
const cors = require('cors');
const config = require('../../config');
const routes = require('./router/index')
const createError = require('http-errors')
const multer = require('multer');
const upload = multer();

module.exports = async () => {
    app.use(cors())
    app.disable('x-powered-by')

    // for parsing multipart/form-data
    app.use(upload.array()); 
    app.use(express.static('public'));
    // for parsing application/json
    app.use(express.json());
    // for parsing application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    routes(app);

    app.use((req, res, next) => {
        next(createError(404, 'Not Found'));
    })

    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.send({
            error: {
                status: err.status || 500,
                message: err.message
            }
        })
    });
}
app.listen(config.PORT, () => {
    console.log(`Server on PORT ${config.PORT}`);
})
