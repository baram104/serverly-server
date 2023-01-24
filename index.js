const express = require("express");
require("dotenv").config();
const cors = require("cors");

const serversRouter = require("./src/routes/servers.route");

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());

app.use("/api/servers", serversRouter);

//Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
});

app.listen(process.env.PORT, () => {
  console.log(`Serverly listening on port ${process.env.PORT}`);
});

module.exports = app;
