const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 4000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Errore nella lettura del file:', error);
        return {};
    }
}

app.get('/orders', async (req, res) => {
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 15;
    const data = await readData();
    const ordersArray = Object.values(data);
    res.json({
        orders: ordersArray.slice(skip, skip + take),
        total: ordersArray.length
    });
});
app.post('/orders', async (req, res) => {
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 15;

    const _data = req.params;
    console.log(_data);
    
    const data = await readData();
    const ordersArray = Object.values(data);
    res.json({
        orders: ordersArray.slice(skip, skip + take),
        total: ordersArray.length
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server avviato sulla porta ${PORT}`);
});