import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const eventSchema = new mongoose.Schema({
  event_datetime_utc: { type: Date, required: true },
  source_name: { type: String, required: true },
  source_url: { type: String, required: true, unique: true },
  source_type: { type: String, required: true },
  claim_text: { type: String, required: true },
  country: { type: String, required: true },
  location_text: { type: String, default: 'Unknown' },
  actor_1: { type: String, default: 'Unknown' },
  actor_2: { type: String, default: 'Unknown' },
  event_type: { type: String, required: true },
  domain: { type: String, required: true },
  severity_score: { type: Number, required: true, min: 1, max: 10 },
  confidence_score: { type: Number, required: true, min: 1, max: 10 },
  tags: { type: [String], default: [] },
  last_updated_at: { type: Date, default: Date.now }
});

export const Event = mongoose.model('Event', eventSchema);
