const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || '5000';
const connectDB = require('./database/db');
const config = require('config');
const debug = require("debug")("server:debug");


/*middlewares*/
app.use(bodyParser.json({
    limit: '150mb',
    verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));

app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    };
    return res.status(500).json(err);
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.get('/', (req, res) => {
    return res.send('Welcome To The Giving Tuesday!!!');
});

/*incudes all routes*/
require('./routes/index')(app, connectDB());

/*listen app on port*/
app.listen(PORT, () => {
    debug(`Server started on ${config.get("name")} mode`);
    console.info(`Server is running on port:${config.get("PORT")} !!.`);
});
