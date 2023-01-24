const dbClient = require("../configs/db.config");

const calcRunningTimePrice = async (server) => {
  const serverRunningTimes = (
    await dbClient.query(
      `SELECT * FROM server_running_times WHERE server_id = ${server.id}`
    )
  ).rows;

  let totalRunningTime = 0;

  for (const serverRunningTime of serverRunningTimes) {
    if (!serverRunningTime.end_datetime) {
      totalRunningTime += Date.now() - serverRunningTime.start_datetime;
      continue;
    }
    totalRunningTime +=
      serverRunningTime.end_datetime - serverRunningTime.start_datetime;
  }

  const totalPrice = server.price_per_minute * (totalRunningTime / 1000 / 60);

  //Parse the time to the format of HH:MM:SS
  totalRunningTime = new Date(totalRunningTime).toISOString().slice(11, 19);
  return { totalRunningTime, totalPrice };
};

const generateNewError = (errMsg, statusCode) => {
  const error = new Error(errMsg);
  error.statusCode = statusCode;
  return error;
};

module.exports = { calcRunningTimePrice, generateNewError };
