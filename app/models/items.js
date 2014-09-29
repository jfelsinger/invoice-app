var mongoose = require('mongoose'),
    _ = require('underscore'),
    Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: { type: String, trim: true},
    desc: { type: String, trim: true},
    rate: Number,
    units: { type: Number, default: 1 },
    isDiscount: { type: Boolean, default: false }
});

ItemSchema
    .virtual('subtotal')
    .set(function(price) {
        this.rate = price / this.units;
    })
    .get(function() {
        return Math.abs(this.rate * this.units).toFixed(2) * (this.isDiscount? -1 : 1);
    });

mongoose.model('Item', ItemSchema);
