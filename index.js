'use strict';

const requireTree = require('require-tree');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./conf/systemConfig.js');

//Runtime global variable
const runtime = {
    conf: config
};

//import utils
const db = require('./utils/db/dbWrapper.js');

const app = express();

//JSON body parser
app.use(bodyParser.json());

//Decode URL query params
app.use(bodyParser.urlencoded({
    extended: true
}));

//handle cors
app.use(cors());

const port = 3000;

//Initialize databases
db.initDatabases(config.databases, (err) => {
    if (err) {
        console.log("Error in initializing databases");
        process.exit(1);
    }

    //Intialize routes
    requireTree('./routes', {
        "each": (functions, filename, path) => {
            if (functions.init)
                functions.init(runtime);

            //Include APIs for server
            if (functions.include)
                return functions.include(app);
        }
    });

    //Initialize models
    requireTree('./models', {
        "each": (functions, filename, path) => {
            if (functions.init)
                return functions.init(runtime);
        }
    });

    //Initialize Controllers
    requireTree('./controllers', {
        "each": (functions, filename, path) => {
            if (functions.init)
                return functions.init(runtime);
        }
    });

    //Initialize utils
    requireTree('./utils', {
        "each": (functions, filename, path) => {
            if (functions.init)
                return functions.init(runtime);
        }
    });

    //Starting Server
    startServer();
});

function startServer() {
    app.listen(port, function(err) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        console.log('server running and listening on port ' + port);
    });
}