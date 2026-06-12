const sanitize = require("mongo-sanitize");

const cleanInput = (input) => {
  return sanitize(input);
};

module.exports = cleanInput;
