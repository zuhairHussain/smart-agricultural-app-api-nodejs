var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var routes = require("./routes");
var config = require("./config");
var bodyParser = require("body-parser");
const { handleError } = require('./helpers/error')

var app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
let dev_db_url = config.dev_mongo_uri;
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(
    mongoDB,
    { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
    next();
});

app.use("/api/v1", routes);

/* Error Handler Middleware */
app.use((err, req, res, next) => {
    handleError(err, res);
});

module.exports = app;
