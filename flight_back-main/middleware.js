const jwt = require("jsonwebtoken");
const config = require("./config");

//needed to be modified to user specific  so other user may not access other user's data only their data
let checkUserToken = (req, res, next) => {
  next();
  return;
  let token = req.headers["authorization"];
  console.log(token);
  token = token.slice(7, token.length);
  if (token) {
    jwt.verify(token, config.key, (err, decoded) => {
      if (err) {
        return res.json({
          status: false,
          msg: "token is invalid",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      status: false,
      msg: "Token is not provided",
    });
  }
};

let checkAdminToken = (req, res, next) => {
  next();
  return;
  let token = req.headers["authorization"];
  token = token.slice(7, token.length);
  console.log(token);
  if (token) {
    jwt.verify(token, config.key, (err, decoded) => {
      console.log(err);
      if (err) {
        req.decoded = decoded;
        console.log(req.decoded);
        return res.json({
          status: false,
          msg: "token is invalid",
        });
      } else {
        req.decoded = decoded;
        console.log(req.decoded);
        if (!req.decoded.isAdmin)
          return res.json({
            status: false,
            msg: "Admin access Invalid",
          });
        next();
      }
    });
  } else {
    return res.json({
      status: false,
      msg: "Token is not provided",
    });
  }
};

module.exports = {
  checkUserToken: checkUserToken,
  checkAdminToken: checkAdminToken,
};
