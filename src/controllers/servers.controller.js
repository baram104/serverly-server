const serversService = require("../services/servers.service");

async function get(req, res, next) {
  try {
    res.status(200).json(await serversService.get());
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await serversService.create(req.body));
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.status(200).json(await serversService.update(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function del(req, res, next) {
  try {
    res.status(200).json(await serversService.del(req.params.id));
  } catch (err) {
    next(err);
  }
}

module.exports = { get, create, del, update };
