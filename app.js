require("dotenv").config();
const express = require("express");

// initialize app
const app = express();

// layout manager for the EJS template engine
const expressLayout = require("express-ejs-layouts");

// method override
const methodOverride = require("method-override");

// To save the cookies and to make use of sessions
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Database Connection
const connectDB = require("./server/config/db");

// To show active route
const { isActiveRoute } = require("./server/helpers/routeHelpers");

// Env variable
const PORT = process.env.PORT || 5000;

// Connecting to DB
connectDB();

// Middleware to parse URL-encoded bodies & JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middlewares
app.use(express.static("public"));
app.use(cookieParser());
app.use(methodOverride("_method"));

// Template Engines
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Active route
app.locals.isActiveRoute = isActiveRoute;

// session
app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// routes
app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

// listening on port
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
