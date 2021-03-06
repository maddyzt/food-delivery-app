// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const cookieSession = require("cookie-session");

const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
const {handleAlreadyLoggedIn} = require("./lib/auth-helper");

db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));
app.use(cookieSession({
  name:'session',
  keys: ['who will find it out'],
  maxAge: 60*60*1000
}));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const authenticationRoutes = require("./routes/authentication");
const menuRoutes = require("./routes/menu");
const ownerRoutes = require("./routes/owner");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/auth", authenticationRoutes(db));
app.use("/api/menu", menuRoutes(db));
app.use("/api/owner", ownerRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", handleAlreadyLoggedIn, (req, res) => {
  res.render("index", { user: req.session });
});

// app.get("/register", (req, res) => {
//   res.render("register");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
