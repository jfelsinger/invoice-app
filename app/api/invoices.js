var mongoose = require('mongoose'),
    async = require('async'),
    Invoice = mongoose.model('Invoice'),
    _ = require('underscore');


// Invoices
// -----------------------------------------
exports.getAll = function(req, res, next) {
    Invoice.find()
        .populate('client')
        .populate('items')
        .exec(function(err, invoices) {
            if (err) return next(err);
            res.json(invoices);
        });
};

exports.get = function(req, res, next) {
    console.log(req.params.invoice_id);

    Invoice.findById(req.params.invoice_id)
        .populate('client')
        .populate('items')
        .exec(function(err, invoices) {
            if (err) return next(err);
            res.json(invoices);
        });
};

exports.post = function(req, res, next) {
    var invoice = new Invoice();

    Invoice.create({
        number: req.body.number,
        client: req.body.client,
        tax: req.body.tax,
    }, function(err, poll) {
        if (err) return next(err);

        res.json(201, {
            message: 'Invoice created!',
            invoice: invoice
        });
    });
};

exports.put = function(req, res, next) {
    Invoice.findById(req.params.invoice_id, function(err, invoice) {
        if (err) return next(err);

        invoice.number = req.body.number;
        invoice.client = req.body.client;
        invoice.tax = req.body.tax;

        invoice.save(function(err) {
            if (err) return next(err);
            res.json(200, { message: 'Invoice updated!' });
        });
    });
};

exports.del = function(req, res, next) {
    Invoice.remove({ _id: req.params.invoice_id }, function(err, invoice) {
        if (err) return next(err);

        res.json(200, { message: 'Invoice deleted' });
    });
};



// Invoices->Items
// -----------------------------------------
var items = function(req, res, next) {
    Invoice.findById(req.params.invoice_id, 'items')
        .exec(function(err, invoice) {
            if (err) return next(err);

            res.json(invoice.items);
        });
};

items.get = function(req, res, next) {
    Invoice.findById(req.params.invoice_id, 'items')
        .exec(function(err, invoice) {
            if (err) return next(err);
            
            var item = invoice.items.id(req.params.item_id);

            if (item == null)
                res.send(404, 'Option not found with id ' + req.params.item_id);

            res.json(item);
        });
};

items.post = function(req, res, next) {
    Invoice.findById(req.params.invoice_id, 'items')
        .exec(function(err, invoice) {
            if (err) return next(err);

            var item = {
                name: req.body.name,
                desc: req.body.desc,
                rate: req.body.rate,
                units: req.body.units,
                isDiscount: req.body.isDiscount,
            };

            invoice.items.push(item);

            invoice.save(function(err) {
                if (err) return next(err);
                res.json(201, {
                    message: 'Item created!',
                    id: invoice.items[invoice.items.length-1]._id
                });
            });
        });
};

items.put = function(req, res, next) {
    Invoice.findById(req.params.invoice_id, 'items')
        .exec(function(err, invoice) {
            if (err) return next(err);

            var item = invoice.items.id(req.params.item_id);

            item.name = req.body.name;
            item.desc = req.body.desc;
            item.rate = req.body.rate;
            item.units = req.body.units;
            item.isDiscount = req.body.isDiscount;

            invoice.save(function(err) {
                if (err) return next(err);
                res.json(201, { message: 'Item updated!' });
            });
        });
};

items.del = function(req, res, next) {
    Invoice.findById(req.params.invoice_id, 'items')
        .exec(function(err, invoice) {
            if (err) return next(err);

            invoice.items.id(req.params.item_id).remove();

            invoice.save(function(err) {
                if (err) return next(err);
                res.json(200, { message: 'Item deleted!' });
            });
        });
};

exports.items = items;



