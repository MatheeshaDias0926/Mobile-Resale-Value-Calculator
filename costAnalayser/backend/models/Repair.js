const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
    issue: { type: String, required: true },
    device: { type: String, required: true },
    guideUrl: { type: String, required: true },
    difficulty: { type: String },
    timeRequired: { type: String },
});

module.exports = mongoose.model('Repair', repairSchema);
