import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ 
        success: true,
        message: 'الخادم يعمل!',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: 'مرحباً بك في العيادة الطبية!'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على port ${PORT}`);
});
