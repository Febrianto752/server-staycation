var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

// import mongoose
const mongoose = require("mongoose");
// connection to mongodb
mongoose.connect("mongodb://localhost:27017/staycation", {
  useNewUrlParser: true,
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// router admin
const adminRouter = require("./routes/admin");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// add method override
app.use(methodOverride("_method"));
// configure static url to assets sbadmin2
app.use(
  "/sb-admin-2",
  express.static(path.join(__dirname, "node_modules/startbootstrap-sb-admin-2"))
);
// setup express session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
// setup connect-flash
app.use(flash());

app.use("/", indexRouter);
app.use("/users", usersRouter);
// routing admin page
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
