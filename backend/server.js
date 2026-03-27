import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, Event } from './db.js';
import { exec } from 'child_process'
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Database Connection
connectDB();

// The Single Route
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ event_datetime_utc: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// NEW ROUTE: Trigger the scraper manually
app.post('/api/sync', (req, res) => {
  console.log('Live sync triggered by analyst...');
  
  // This tells the server to run your seed.js file in the background
  exec('node seed.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Sync error: ${error}`);
      return res.status(500).json({ error: 'Failed to fetch live data' });
    }
    console.log(`Sync complete. Output: ${stdout}`);
    res.json({ message: 'OSINT feeds synchronized successfully' });
  });
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));