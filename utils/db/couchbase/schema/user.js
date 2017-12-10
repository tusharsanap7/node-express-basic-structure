'use strict';

const joi = require('joi');

const userDocument = {
	"id": joi.string().required(),
	"name": joi.string().required(),
	"age": joi.number().optional()
};

module.exports = joi.object(userDocument).unknown();
