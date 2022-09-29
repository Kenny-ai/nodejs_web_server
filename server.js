const express = require("express");
const app = express();

const path = require("path");
const PORT = process.env.PORT || 3500;

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});
app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});

// Chaining Route handlers
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load hello.html");
    next(); // this calls the next route handler below
  },
  (req, res) => {
    res.send("Hello world");
  }
);

// Another way of chaining route handlers
const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res) => {
  console.log("three");
  res.send("Finished!");
};

// using all the functions in one route handler
app.get("/chain(.html)?", [one, two, three]);

// if it doesn't find the route specified
app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
