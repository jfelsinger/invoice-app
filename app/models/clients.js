var mongoose = require('mongoose'),
    _ = require('underscore'),
    Schema = mongoose.Schema;

var ClientSchema = new Schema({
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    mobile: { type: String, trim: true },
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        zipcode: String,
    },
    invoices: [{ type: Schema.ObjectId, ref: 'Invoice' }]
});

mongoose.model('Client', ClientSchema);
