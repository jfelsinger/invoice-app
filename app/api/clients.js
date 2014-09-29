var mongoose = require('mongoose'),
    async = require('async'),
    Client = mongoose.model('Client'),
    _ = require('underscore');


// Clients
// -----------------------------------------
exports.getAll = function(req, res, next) {
    Client.find()
        .populate('invoices.items')
        .exec(function(err, clients) {
            if (err) return next(err);
            res.json(clients);
        });
};

exports.get = function(req, res, next) {
    Client.findById(req.params.client_id)
        .populate('invoices.items')
        .exec(function(err, client) {
            if (err) return next(err);
            res.json(client);
        });
};

exports.post = function(req, res, next) {
    var client = new Client();

    Client.create({
        name: res.body.name,
        email: res.body.email,
        phone: res.body.phone,
        mobile: res.body.mobile,
        address: res.body.address
    }, function(err, client) {
        if (err) return next(err);

        res.json(201, {
            message: 'Client created!',
            client: client
        });
    });
};

exports.put = function(req, res, next) {
    Client.findById(req.params.client_id, function(err, client) {
        if (err) return next(err);

        client.name = req.body.name;
        client.email = req.body.email;
        client.phone = req.body.phone;
        client.mobile = req.body.mobile;
        client.address = req.body.address;

        client.save(function(err) {
            if (err) return next(err);
            res.json(200, { message: 'Client updated!' });
        });
    });
};

exports.del = function(req, res, next) {
    Client.remove({ _id: req.params.client_id }, function(err, client) {
        if (err) return next(err);
        res.json(200, { message: 'Poll updated!' });
    });
};



// Clients->Invoices
// -----------------------------------------

// NOTE: have to make sure these functions work right

var invoices = function(req, res, next) {
    Client.findById(req.params.client_id, 'invoices')
        .exec(function(err, client) {
            if (err) return next(err);
            res.json(client.invoices);
        });
};

invoices.get = function(req, res, next) {
    Client.findById(req.params.client_id, 'invoices')
        .exec(function(err, client) {
            if (err) return next(err);
            
            var invoice = client.invoices.id(req.params.invoice_id);

            if (invoice == null)
                res.send(404, 'Invoice not found with id ' + req.params.invoice_id);

            res.json(invoice);
        });
};

// TODO: create function to add invoice to a client

invoices.del = function(req, res, next) {
    Invoice.findById(req.params.invoice_id, 'invoices')
        .exec(function(err, invoice) {
            if (err) return next(err);

            invoice.invoices.id(req.params.invoice_id).remove();

            invoice.save(function(err) {
                if (err) return next(err);
                res.json(200, { message: 'Invoice removed!' });
            });
        });
};

exports.invoices = invoices;
