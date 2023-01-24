const validator = require("validator");
const dbClient = require("../configs/db.config");
const { generateNewError } = require("../utils/helper.util");

const validateCreateServerInputs = async (req, res, next) => {
  try {
    if (
      !validator.isIP(req.body.ip) ||
      !validator.isAlphanumeric(req.body.name)
    ) {
      throw generateNewError("IP or name invalid", 400);
    }

    const serverTypes = (
      await dbClient.query("SELECT name FROM server_types")
    ).rows.map((type) => type.name);

    if (!validator.isIn(req.body.type, serverTypes)) {
      throw generateNewError("Type doesn't exist", 400);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validateCreateServerInputs;
