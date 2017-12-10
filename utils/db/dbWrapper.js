'use strict';
/**
 * @file Wrapper for database operations
 * @version 0.0.1
 * @author Tushar Sanap <tusharsanap7@gmail.com>
 */
// const couchbase = require('./couchbase/couchbaseWrapper.js');
const requireTree = require('require-tree');
const async = require('neo-async');

let R;
const databases = requireTree("./");
/**
 *	Now databases object will have "database name" as key and another object containing "wrapper" object
 *	exposing various permissible database operations defined
 *	e.g databases = {
 *		"couchbase": {
 *			"wrapper": {
 *				"get": [function],
 *				"set": [function] ...
 *			}
 *		}
 *	}
 *	This will be converted to 
 *	 databases = {
 *		"couchbase": {
 *			"get": [function],
 *			"set": [function] ...
 *		}
 *	}
 */
for (let databaseName in databases)
    if (databases[databaseName].wrapper)
        databases[databaseName] = databases[databaseName].wrapper;
    else delete databases[databaseName];

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
 * Initiate Databases
 * @description This function initiates all databases provided in config
 * @version 0.0.1
 * @param {Object} conf Database connection configurations
 * @param {Function} callback This will be invoked after database initializations
 */
function initDatabases(conf, callback) {
    /*
     *	This conf will be having all database connection configurations
     *  conf = {
     *      "couchbase": {
     *			"host": "127.0.0.1",
     *      	"authorisation": {
     *          	 "username": "Administrator",
     *           	"password": "root@123"
     *       	},
     *      	"httpHost": "http://127.0.0.1:8091"
     *  	},
     *		"redis": {
     *			"host": "127.0.0.1",
     *			"port": "7000"
     *		}
     */
     console.log("sdvkjbd");
    async.forEachOf(databases, (databaseExportedFunctions, databaseName, cb) => {
        if (conf[databaseName]) {
            console.log("-----------------------------------------------------\n",
                "Connecting to", databaseName, "with config", conf[databaseName],
                "\n-----------------------------------------------------");
            if (!databaseExportedFunctions.connect) {
                console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++\n",
                    databaseName, "doestn't have connect function exported. So can't connect!!",
                    "\n+++++++++++++++++++++++++++++++++++++++++++++++++++++");
                delete databases[databaseName];
                return cb(null);
            }

            databaseExportedFunctions.connect(conf[databaseName], (err) => {
                if (err) {
                    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++\n",
                        databaseName, "cant't connect because =>\n", err,
                        "\n+++++++++++++++++++++++++++++++++++++++++++++++++++++");
                    delete databases[databaseName];
                } else console.log("-----------------------------------------------------\n",
                    databaseName, "connected!",
                    "\n-----------------------------------------------------");
                return cb(err);
            });

        } else {
            console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++\n",
                databaseName, "doesn't have config in database Configrations. So cant't connect!!",
                "\n+++++++++++++++++++++++++++++++++++++++++++++++++++++");
            delete databases[databaseName];
            return cb(null);
        }
    }, (err) => {
        return callback(err);
    });
}

/**
 * Get Wrapper Functions
 * @description This function will return all database wrapper functions after initializations
 * @version 0.0.1
 * @return {Object} databases All databases wrapper functions available
 */
function get() {
    return databases;
}

module.exports = {
    "initDatabases": initDatabases,
    "init": init,
    "get": get
};