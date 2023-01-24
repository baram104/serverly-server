const dbClient = require("../configs/db.config");
const { calcRunningTimePrice } = require("../utils/helper.util");

async function create({ name, ip, type }) {
  const getServerTypeIdQuery = {
    text: "SELECT id FROM server_types WHERE name = $1",
    values: [type],
  };

  const { id: serverTypeId } = (await dbClient.query(getServerTypeIdQuery))
    .rows[0];

  const createServerQuery = {
    text: "INSERT INTO servers(name,ip,server_type_id) VALUES($1,$2,$3) RETURNING id",
    values: [name, ip, serverTypeId],
  };

  const { id: serverId } = (await dbClient.query(createServerQuery)).rows[0];

  const createRunningTimeQuery = {
    text: "INSERT INTO server_running_times(server_id) VALUES($1) RETURNING id",
    values: [serverId],
  };

  await dbClient.query(createRunningTimeQuery);

  return { message: "success" };
}

async function get() {
  const servers = (
    await dbClient.query(
      "SELECT *,s.name,s.id,st.price_per_minute,st.name as type FROM servers s JOIN server_types st on s.server_type_id = st.id WHERE active = TRUE"
    )
  ).rows;

  for (const server of servers) {
    const { totalPrice, totalRunningTime } = await calcRunningTimePrice(server);
    server.totalPrice = totalPrice;
    server.totalRunningTime = totalRunningTime;
  }

  return servers;
}

async function del(id) {
  const deleteQuery = {
    text: "UPDATE servers SET active = FALSE, is_running = FALSE WHERE id = $1",
    values: [id],
  };

  await dbClient.query(deleteQuery);

  const updateRunningTimeQuery = {
    text: "UPDATE server_running_times SET end_datetime = now() WHERE server_id = $1 AND end_datetime is NULL",
    values: [id],
  };

  await dbClient.query(updateRunningTimeQuery);

  return { message: "success" };
}

async function update(id) {
  const updateIsRunningQuery = {
    text: "UPDATE servers SET is_running = NOT is_running WHERE id=$1 RETURNING is_running",
    values: [id],
  };

  const { is_running: isRunning } = (await dbClient.query(updateIsRunningQuery))
    .rows[0];

  let runningTimeQueryTxt;

  if (isRunning) {
    //Create a new running time because the server has been turned on.
    runningTimeQueryTxt =
      "INSERT INTO server_running_times(server_id) values($1)";
  } else {
    //Updating the running time as the server has been turned off.
    runningTimeQueryTxt =
      "UPDATE server_running_times SET end_datetime = now() WHERE server_id = $1 AND end_datetime is NULL";
  }

  const updateRunningTimesQuery = {
    text: runningTimeQueryTxt,
    values: [id],
  };

  await dbClient.query(updateRunningTimesQuery);

  return { message: "success" };
}

module.exports = { create, get, del, update };
