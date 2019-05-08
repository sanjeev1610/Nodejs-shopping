var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', OrderSchema);