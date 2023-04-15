const jwt = require("jsonwebtoken");
const config = require("../configurations/config");

const auth = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (authorization) {
    // validate the token
    const token = authorization.split(" ").pop();

    if (token) {
      try {
        jwt.verify(token, config.JWT_SECRET_KEY);
        let user = jwt.decode(token);
        //When user is authenticated we give additional property to request object (id ) to be used by next function.
        req.user = user;
        next();
      } catch (err) {
        console.error(err);
        res.status(401).send({
          type: "faliure",
          message: "Invalid token provided",
        });
      }
    } else {
      res.status(401).send({
        type: "faliure",
        message: "No auth token present",
      });
    }
  } else {
    res.status(401).send({
      type: "faliure",
      message: "User is not logged in, no authorization provided in header",
    });
  }
};

module.exports = auth;
