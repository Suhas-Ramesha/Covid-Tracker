const mongoose = require('mongoose');

const CovidDataSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    totalCases: {
        type: Number,
        required: true
    },
    totalDeaths: {
        type: Number,
        required: true
    },
    totalRecovered: {
        type: Number,
        required: true
    },
    newCases: {
        type: Number,
        required: true
    },
    newDeaths: {
        type: Number,
        required: true
    },
    population: {
        type: Number,
        required: true
    },
    mortalityRate: {
        type: Number,
        required: false
    },
    source: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
});

// Calculate mortality rate before saving
CovidDataSchema.pre('save', function(next) {
    if (this.totalCases > 0) {
        this.mortalityRate = (this.totalDeaths / this.totalCases) * 100;
    } else {
        this.mortalityRate = 0;
    }
    next();
});

// Indexes for faster queries
CovidDataSchema.index({ date: 1, country: 1, region: 1 });
CovidDataSchema.index({ country: 1 });
CovidDataSchema.index({ date: 1 });

const CovidData = mongoose.model('CovidData', CovidDataSchema);
module.exports = CovidData; 