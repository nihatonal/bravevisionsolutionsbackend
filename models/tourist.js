const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const touristSchema = new Schema({
        country: { type: String, required: true },
        country_id: { type: String, required: true },
        city: { type: String, required: true },
        otel: { type: String, required: true },
        date: { type: String, required: true },
        cost: { type: String, required: true },
        touristname: { type: String, required: true },
        touristemail: { type: String, required: true },
        touristphone: { type: String, required: true },
        touristcode: { type: String, required: true },
        link: { type: String, required: true },
        comment: { type: String, required: false },
        image: { type: String, required: false },
        images: [],

});


module.exports = mongoose.model('Tourists', touristSchema);