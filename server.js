const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const amazon = require('amazon-product-api');
var process = require('process');

/*process.env = Object.assign(process.env, require('./amazon-config'));*/
const config = require('./config');

const app = express();
app.use(express.static('build')); // Serve the build folder.
app.use('/modules', express.static(__dirname + '/node_modules/')); // Serve the node_modules folder.
app.use(bodyParser.json()); // Used for getting parameters in post requests.

/**
 * Helper Functions
 */
// Client for accessing the Amazon Product Advertising API.
const client = amazon.createClient({
  awsTag: process.env.AWS_TAG,
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET
});

/**
 * Routes
 */

/**
 * Run the server
 */
const runServer = function(callback) {
  console.log(process.env, 33);
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

/**
 * Exports
 */
exports.app = app;
exports.runServer = runServer;