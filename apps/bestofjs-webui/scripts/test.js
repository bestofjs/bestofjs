"use strict";
require("dotenv").config();

process.env.NODE_ENV = "test";

const jest = require("jest");
const argv = process.argv.slice(2);

jest.run(argv);
