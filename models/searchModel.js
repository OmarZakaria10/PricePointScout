const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    query: {
        type: String,
        required: true
    },
    results: {
        type: Array,
        default: [] // Array to store search results
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Search = mongoose.model('Search', searchSchema);
module.exports = Search;