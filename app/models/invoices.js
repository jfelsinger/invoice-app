var mongoose = require('mongoose'),
    _ = require('underscore'),
    Schema = mongoose.Schema;

var InvoiceSchema = new Schema({
    number: { type: String, trim: true },
    client: { type: Schema.ObjectId, ref: 'Client' },
    items: [{ type: Schema.ObjectId, ref: 'Item' }],
    tax: { type: Number }
});

InvoiceSchema
    .virtual('cost')
    .get(function() {
        return this.items.reduce(function(prev, curr) {
            if (!curr.isDiscount)
                return prev + curr.subtotal;
        }, 0).toFixed(2);
    });

InvoiceSchema
    .virtual('discount')
    .get(function() {
        return this.items.reduce(function(prev, curr) {
            if (curr.isDiscount)
                return prev + curr.subtotal;
        }, 0).toFixed(2);
    });

InvoiceSchema
    .virtual('subtotal')
    .get(function() {
        return this.items.reduce(function(prev, curr) {
            return prev + curr.subtotal;
        }, 0).toFixed(2);
    });

InvoiceSchema
    .virtual('total')
    .get(function() {
        return this.subtotal + this.tax;
    });

mongoose.model('Invoice', InvoiceSchema);
