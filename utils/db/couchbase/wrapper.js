'use strict';
/**
 * @file Wrapper for couchbase database operations
 * @version 0.0.1
 * @author Tushar Sanap <tusharsanap7@gmail.com>
 */
const couchbase = require('couchbase');
const request = require('request');
const ORM = require('./ORM.js');

let R, couchBuckets = {}, cluster;
request.defaults = {
    "proxy": null
};

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
 * Connect Couchbase Instance
 * @description This function connects to couchbase instance and return the connection object
 * @version 0.0.1
 * @param {Object} conf Couchbase connection configurations
 * @return {Object} connection Return Couchbase connection object
 */
function connect(conf, callback) {
    /*
     *	This conf can be single couchbase instance or couchbase cluster
     *  conf = {
     *      "host": "127.0.0.1",
     *      "authorisation": {
     *           "username": "Administrator",
     *           "password": "root@123"
     *       },
     *      "httpHost": "http://127.0.0.1:8091"
     *  }
     *	e.g single couchbase -> host = "127.0.0.1" //host IP
     *		cluster couchbase -> host = ["127.0.0.1", "10.144.12.12",...]
     */
    if (Array.isArray(conf.host)) {
        let hostString = "couchbase://";
        for (let couchNode of conf.host)
            hostString += couchNode + "?detailed_errcodes=1,";
        hostString = hostString.substr(0, hostString.length - 1);
        cluster = new couchbase.Cluster(hostString);
    } else cluster = new couchbase.Cluster("couchbase://" + conf.host);

    if (conf.authorisation)
        cluster.authenticate(conf.authorisation);

    fetchBucketList(conf, callback);
}

/**
 * fetchBucketList
 * @description This function will request bucket list from couchbase and will preseve the opened bucket objects in couchBuckets object.
 * @version 0.0.1
 * @param {Object} conf - Couchbase config
 * @param {Function} callback Function to be invoked after processing
 */
function fetchBucketList(conf, callback) {
    /*
     *	Couchbase Http IP is with host and port
     *	e.g http://127.0.0.1:8091
     */

    let bucketRequest = {
        "url": conf.httpHost + "/pools/default/buckets",
        "auth": conf.authorisation,
        "timeout": 20000,
        "proxy": null
    };
    request.get(bucketRequest, (err, res, buckets) => {
        if (err) {
            console.log(err);
            return callback(err);
        }
        /*
         *	Will maintain bucket object couchBuckets Object with keyname = "bucketName"
         */
        try {
            buckets = JSON.parse(buckets);
        } catch (exception) {
            return callback(exception);
        }
        for (let bucket of buckets)
            couchBuckets[bucket.name] = cluster.openBucket(bucket.name);
        return callback(null);
    });
}

/**
 * Get Document from Couchbase
 * @description This function gets a document from couchbase for given key from given bucket
 * @version 0.0.1
 * @param {String} bucketName Couchbase bucket name from which doucument needs to be fethed
 * @param {String} key Key of doucument needs to be fethed
 * @param {Function} callback callback which need to be invoked after database call
 * @return {Object, Object} err,res Invokes callback with error if any and data fetched
 */
function get(bucketName, key, callback) {
    //temporary doc read from files
    /*
        fs.readFile("../../../tests/data/" + key + ".json", 'utf8', (err, res) => {
            if (err) {
                console.log(err)
                return callback(err, res);
            }
            res = JSON.parse(res);
            return callback(err, res);
        });
    */
    //actual db call to couch base
    couchBuckets[bucketName].get(key, function(err, res) {
        if (err) {
            console.log(err);
            return callback(err, res);
        }
        res = res.value;
        return callback(err, res);
    });

}

/**
 * Add/Update a Document to Couchbase
 * @description This function upserts a document to couchbase for given key in given bucket
 * @version 0.0.1
 * @param {String} bucketName Couchbase bucket name from which doucument needs to be added/updated
 * @param {String} documentType Type of doucument - will be used for validation (filename of schema defined without ".js")
 * @param {String} key Key of doucument
 * @param {String} data data to be stored
 * @param {Function} callback callback which need to be invoked after database call
 * @return {Object, Object} err,res Invokes callback with error if any and response
 */
function set(bucketName, documentType, key, data, callback) {
    //temporary doc read from files
    /*
        fs.readFile("../../../tests/data/" + key + ".json", 'utf8', (err, res) => {
            if (err) {
                console.log(err)
                return callback(err, res);
            }
            res = JSON.parse(res);
            return callback(err, res);
        });
    */
    //actual db call to couch base
    const validationResults = ORM.validate(data, documentType);
    if (validationResults.error)
        return callback(validationResults, null);
    couchBuckets[bucketName].upsert(key, data, function(err, res) {
        if (err) {
            console.log(err);
            return callback(err, res);
        }
        return callback(err, res);
    });
}

module.exports.init = init;
module.exports.connect = connect;
module.exports.set = set;
module.exports.get = get;