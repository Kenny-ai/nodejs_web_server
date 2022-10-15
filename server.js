const express = require("express");
const app = express();
const cors = require("cors");
const { corsOptions } = require("./config/corsOptions");
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const { credentials } = require("./middleware/credentials");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Handle options credentials check before CORS
// and fetch coockie credentials requirement
app.use(credentials);

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data in other words,form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
// this serves all the files in the public folder (css, images and more...)
app.use(express.static(path.join(__dirname, "/public")));

// using routers created in routes dir
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

// if it doesn't find the route specified
app.all("/*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// error handling
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Chaining Route handlers
// app.get(
//   "/hello(.html)?",
//   (req, res, next) => {
//     console.log("attempted to load hello.html");
//     next(); // this calls the next route handler below
//   },
//   (req, res) => {
//     res.send("Hello world");
//   }
// );

// // Another way of chaining route handlers
// const one = (req, res, next) => {
//   console.log("one");
//   next();
// };
// const two = (req, res, next) => {
//   console.log("two");
//   next();
// };
// const three = (req, res) => {
//   console.log("three");
//   res.send("Finished!");
// };

// // using all the functions in one route handler
// app.get("/chain(.html)?", [one, two, three]);
