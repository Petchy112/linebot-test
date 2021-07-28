const express = require('express')
const app = express();
const cors = require('cors');
const config = require('../../config');
const routes = require('./router/index')
const createError = require('http-errors')

app.use(cors())
app.use(express.json());
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

app.listen(config.PORT, () => {
    console.log(`Server on PORT ${config.PORT}`);
})