/**
 * Parivahan Sewa - Node.js / Express Backend Server
 */

const express = require('express');
const path = require('path');
try { require('dotenv').config({ path: path.join(__dirname, '../../.env') }); } catch (e) {}
try { require('dotenv').config(); } catch (e) {}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// ----------------------------------------------------
// REST API Mock Endpoints
// ----------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'Parivahan Sewa Redesign API',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Vehicle RC Status
app.get('/api/rc/status', (req, res) => {
    const regNo = (req.query.regNo || '').trim().toUpperCase();
    if (!regNo) {
        return res.status(400).json({ error: 'Vehicle Registration Number is required' });
    }

    res.json({
        registrationNumber: regNo,
        status: 'ACTIVE',
        vehicleClass: 'Motor Car (LMV)',
        makerModel: 'Maruti Suzuki Swift VXI',
        registrationDate: '2021-04-15',
        fitnessValidUntil: '2036-04-14',
        insuranceValidUntil: '2027-04-10',
        puccValidUntil: '2027-02-28',
        fuelType: 'PETROL'
    });
});

// Driving License Status
app.get('/api/dl/status', (req, res) => {
    const dlNo = (req.query.dlNo || '').trim().toUpperCase();
    if (!dlNo) {
        return res.status(400).json({ error: 'Driving License Number is required' });
    }

    res.json({
        licenseNumber: dlNo,
        status: 'VALID',
        holderName: 'Aadhaar Verified Citizen',
        issueDate: '2016-08-10',
        validityNonTransport: '2036-08-09',
        authorizedClasses: ['LMV', 'MCWG']
    });
});

// eChallan Status
app.get('/api/challan/status', (req, res) => {
    const query = (req.query.number || '').trim().toUpperCase();
    if (!query) {
        return res.status(400).json({ error: 'Challan Number or Vehicle Number is required' });
    }

    res.json({
        query: query,
        pendingChallansCount: 0,
        message: 'No pending challans found for this search.'
    });
});

// OpenAI API Proxy
app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'OPENAI_API_KEY is missing in .env' });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        console.error('OpenAI Proxy Error:', err);
        res.status(500).json({ error: 'Failed to communicate with OpenAI server' });
    }
});

// Fallback to index.html for Single Page Applications
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server (only when run directly or locally)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(` Parivahan Sewa Server running on http://localhost:${PORT}`);
        console.log(` Static Assets: ${frontendPath}`);
        console.log(`====================================================`);
    });
}

module.exports = app;
