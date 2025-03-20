// In-memory storage for signals (replace with database in production)
const signals = [
    {
        id: 1,
        symbol: 'BTC/USD',
        type: 'BUY',
        price: 45000,
        timestamp: new Date(),
        metadata: {
            strength: 'STRONG',
            timeframe: '4H',
            indicators: {
                rsi: 32,
                macd: 'bullish',
                movingAverages: 'uptrend'
            }
        }
    }
];

const signalController = {
    // Get all signals
    getAllSignals: (req, res) => {
        try {
            // Add basic filtering
            const { symbol, type } = req.query;
            let filteredSignals = [...signals];

            if (symbol) {
                filteredSignals = filteredSignals.filter(signal => 
                    signal.symbol.toLowerCase().includes(symbol.toLowerCase())
                );
            }

            if (type) {
                filteredSignals = filteredSignals.filter(signal => 
                    signal.type.toLowerCase() === type.toLowerCase()
                );
            }

            res.json(filteredSignals);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching signals', error: error.message });
        }
    },

    // Get single signal by ID
    getSignalById: (req, res) => {
        try {
            const signal = signals.find(s => s.id === parseInt(req.params.id));
            
            if (!signal) {
                return res.status(404).json({ message: 'Signal not found' });
            }

            res.json(signal);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching signal', error: error.message });
        }
    },

    // Create new signal (protected route - only for admin)
    createSignal: (req, res) => {
        try {
            const { symbol, type, price, metadata } = req.body;

            const newSignal = {
                id: signals.length + 1,
                symbol,
                type,
                price,
                timestamp: new Date(),
                metadata
            };

            signals.push(newSignal);
            res.status(201).json(newSignal);
        } catch (error) {
            res.status(500).json({ message: 'Error creating signal', error: error.message });
        }
    },

    // Get latest signals (useful for real-time updates)
    getLatestSignals: (req, res) => {
        try {
            const count = parseInt(req.query.count) || 5;
            const latestSignals = signals
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, count);

            res.json(latestSignals);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching latest signals', error: error.message });
        }
    }
};

module.exports = signalController;
