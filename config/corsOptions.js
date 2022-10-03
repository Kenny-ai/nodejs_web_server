// the whilelist is an array of domains that can access the server

const whitelist = ["https://www.site.com", "http://localhost:3500"];
exports.corsOptions = {
  origin: (origin, callback) => {
    // remove !== origin after develpoment
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
