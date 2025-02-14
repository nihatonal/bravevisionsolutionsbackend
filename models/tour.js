const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tourSchema = new Schema({
        location: { type: String, required: true },
        otel: { type: String, required: true },
        date: { type: String, required: true },
        link: { type: String, required: true },
        comment: { type: String, required: true },
        creator: { type: mongoose.Types.ObjectId, required: true, ref: 'Tourist' }
});

module.exports = mongoose.model('Tour', tourSchema);