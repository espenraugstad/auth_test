const express = require("express");
const server = express();
require("dotenv").config();
const { auth, requiresAuth } = require("express-openid-connect");

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.baseURL,
  clientID: process.env.clientID,
  issuerBaseURL: process.env.issuerBaseURL,
  secret: process.env.secret,
};

server.use(auth(config));
server.use(express.static("public"));
server.use(express.json());

const PORT = process.env.PORT || 3000;

server.get("/isLoggedIn", (req, res) => {
  let isLoggedIn = req.oidc.isAuthenticated();

  try {
    res.json({ isLoggedIn: isLoggedIn });
  } catch (err) {
    console.log(err);
  }

  /* res
    .json(req.oidc.isAuthenticated() ? { loggedIn: true } : { loggedIn: false })
    .end(); */
});

server.get("/getProfile", requiresAuth(), (req, res) => {
  console.log("Getting profile!");
  res.send(JSON.stringify(req.oidc.user));
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
