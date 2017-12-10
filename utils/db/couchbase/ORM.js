'use strict';
/**
 * @file ORM for couchbase database operations
 * @version 0.0.1
 * @author Tushar Sanap <tusharsanap7@gmail.com>
 */
const requireTree = require('require-tree');
const joi = require('joi');
/*
 *	schema path is where all schema files are saved
 *	require tree will collect all exported schemas in "schemas" object with schema file name as its key
 *	e.g schemas {
 *		"user": joi validator object for user document
 *		"miscellaneous": joi validator object for mescellaneous documents
 *	}
 */
const schemaPath = './schema';
const schemas = requireTree(schemaPath);
const miscellaneousDocumetType = 'miscellaneous';

let R;
/**
 * Init
 * @description This function saves global runtime object in variable R for local use
 * @version 0.0.1
 * @param {Object} runtime - runtime object from index
 */
function init(runtime) {
    R = runtime;
}

/**
 * Schema validator for Couchbase documents
 * @description This function will validate if data to be updated is according to document schema 
 * @version 0.0.1
 * @param {Object} data Data to be validated
 * @param {String} documentType Type of document with which data needs to be validated
 * @returns {Boolean} response Returns true if data get validated correctly
 */
function validate(data, documentType) {
    if (!documentType || !schemas[documentType])
        documentType = miscellaneousDocumetType;
    const results = joi.validate(data, schemas[documentType]);
    return results;
}

module.exports.init = init;
module.exports.validate = validate;