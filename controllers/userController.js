'use strict';
/**
 * @file Controller for user routes
 * @version 0.0.1
 * @author Tushar Sanap <tusharsanap7@gmail.com>
 */

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
 * Get 
 * @description This function performs computations and generates response
 * @version 0.0.1
 * @param {Object} req - request object
 * @param {Object} callback - callback to be invoked after computations
 */
function get(req, callback) {
	let response = "Hello World";
    return callback(null, response);
}

module.exports = {
	get: get,
	init: init
};