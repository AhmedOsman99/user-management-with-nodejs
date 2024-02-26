const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

function authenticate(req, res, next) {
  const token = req.get("authorization").slice(7);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: err });
    }

    req.user = decoded;
    next();
  });
}

module.exports = authenticate;
