const express = require('express');
const router = express.Router();
const CovidData = require('../models/CovidData');
const auth = require('../middleware/auth');

// Get all COVID data
router.get('/', auth, async (req, res) => {
    try {
        const data = await CovidData.find().sort({ date: -1 });
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get COVID data by country
router.get('/country/:country', auth, async (req, res) => {
    try {
        const data = await CovidData.find({ country: req.params.country })
            .sort({ date: -1 });
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add new COVID data
router.post('/', auth, async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['date', 'country', 'region', 'totalCases', 'totalDeaths', 
                              'totalRecovered', 'newCases', 'newDeaths', 'population', 'source'];
        
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                msg: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate numeric fields
        const numericFields = ['totalCases', 'totalDeaths', 'totalRecovered', 
                             'newCases', 'newDeaths', 'population'];
        
        const invalidFields = numericFields.filter(field => 
            isNaN(req.body[field]) || req.body[field] < 0
        );
        
        if (invalidFields.length > 0) {
            return res.status(400).json({
                msg: `Invalid numeric values for fields: ${invalidFields.join(', ')}`
            });
        }

        // Validate date
        const date = new Date(req.body.date);
        if (isNaN(date.getTime())) {
            return res.status(400).json({
                msg: 'Invalid date format'
            });
        }

        const newData = new CovidData({
            ...req.body,
            date: date
        });

        const savedData = await newData.save();
        res.json(savedData);
    } catch (err) {
        console.error('Error saving COVID data:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                msg: 'Validation Error',
                errors: Object.values(err.errors).map(e => e.message)
            });
        }
        if (err.name === 'MongoError' || err.name === 'MongoServerError') {
            return res.status(500).json({
                msg: 'Database Error',
                error: err.message
            });
        }
        res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
});

// Update COVID data
router.put('/:id', auth, async (req, res) => {
    try {
        const data = await CovidData.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!data) {
            return res.status(404).json({ msg: 'Data not found' });
        }
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete COVID data
router.delete('/:id', auth, async (req, res) => {
    try {
        const data = await CovidData.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(404).json({ msg: 'Data not found' });
        }
        res.json({ msg: 'Data removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get statistics
router.get('/stats', auth, async (req, res) => {
    try {
        const stats = await CovidData.aggregate([
            {
                $group: {
                    _id: '$country',
                    totalCases: { $sum: '$totalCases' },
                    totalDeaths: { $sum: '$totalDeaths' },
                    avgMortalityRate: { $avg: '$mortalityRate' }
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; 