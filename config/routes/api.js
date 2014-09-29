/**
 * API
 * Routes that manage API methods
 */

var async = require('async'),
    express = require('express');

module.exports = function(app) {
    var router = express.Router();

    var tests = require('../../app/api/test');
    var invoices = require('../../app/api/invoices');
    var clients = require('../../app/api/clients');

    // Test routes
    // -----------------------------------------
    router.route('/tests')
        .get(tests.get);

    // Invoice routes
    // -----------------------------------------
    router.route('/invoices')
        .get(invoices.getAll)
        .post(invoices.post);

    router.route('/invoice')
        .post(invoices.post)

    router.route('/invoice/:invoice_id')
        .get(invoices.get)
        .put(invoices.put)
        .delete(invoices.del);

    // Invoice->Items routes
    // -----------------------------------------
    router.route('/invoice/:invoice_id/items')
        .get(invoices.items)
        .post(invoices.items.post);

    router.route('/invoice/:invoice_id/item')
        .post(invoices.items.post);

    router.route('/invoice/:invoice_id/item/:item_id')
        .get(invoices.items.get)
        .put(invoices.items.put)
        .delete(invoices.items.del);

    // Client routes
    // -----------------------------------------
    router.route('/clients')
        .get(clients.getAll)
        .post(clients.post);

    router.route('/client')
        .post(clients.post)

    router.route('/client/:client_id')
        .get(clients.get)
        .put(clients.put)
        .delete(clients.del);

    // Client->Invoices routes
    // -----------------------------------------
    router.route('/client/:client_id/invoices')
        .get(clients.invoices);

    router.route('/client/:client_id/invoice/:invoice_id')
        .get(clients.invoices.get)
        .delete(clients.invoices.del);


    // Allow all domains
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type');
        res.header('Access-Control-Allow-Credentials', true);
        next();
    });

    app.use('/api', router);
};
