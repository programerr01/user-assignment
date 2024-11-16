const mongoose = require('mongoose');


const Assignment = mongoose.model('Assignment', {
    title: String,
    status: { type: String, enum: ['pending', 'accept', 'reject'], default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = Assignment;
