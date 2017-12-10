'use strict';
module.exports = {
    "databases": {
        "couchbase": {
            "host": "127.0.0.1",
            "authorisation": {
                "username": "Administrator",
                "password": "root@123"
            },
            "httpHost": "http://127.0.0.1:8091"
        },
        "redis": {
            "host": "127.0.0.1",
            "port": 7000
        }
    }
};