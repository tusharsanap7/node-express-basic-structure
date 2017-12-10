'use strict';
/**
 * @file Routes for user
 * @version 0.0.1
 * @author Tushar Sanap <tusharsanap7@gmail.com>
 */
const userController = require('../controllers/userController.js');

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
 * Include 
 * @description This function includes the specified router to express ruter
 * @version 0.0.1
 * @param {Object} app - express router object
 */
function include(app) {
    app.get('/', function(req, res) {
    	//call respective controller function
    	userController.get(req, (err, response)=>{
    		if(err){
    			//log error
    			console.log(err);
    			return res.status(503).send("Service Unavailable!");
    		}
    		return res.status(200).send(response);
    	});
    });
} //route(app)

module.exports = {
	include: include,
	init: init
};