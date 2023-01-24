const validator = require("validator");
const dbClient = require("../configs/db.config");
const { generateNewError } = require("../utils/helper.util");

const valdiateIdParam = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!validator.isNumeric(id)) {
      throw generateNewError("Id must be an integer", 400);
    }

    const server = (
      await dbClient.query({
        text: "SELECT * FROM servers WHERE id=$1",
        values: [id],
      })
    ).rows[0];

    if (!server) {
      throw generateNewError("No such server Id", 400);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = valdiateIdParam;
