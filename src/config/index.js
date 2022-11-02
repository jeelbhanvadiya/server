const env = process.env.NODE_ENV || "production";
console.log(env);

const config = require(`./environments/${env.toLowerCase()}`);

module.exports = config;
