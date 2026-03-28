import { connectDB, Event } from './db.js';
import axios from 'axios';
import Parser from 'rss-parser';
import nlp from 'compromise';

const rssParser = new Parser();

// --- STRICT CONFLICT FILTER ---
// --- STRICT CONFLICT FILTER ---
// --- STRICT IRAN-CENTRIC FILTER ---
// Only pull articles where the Iran ecosystem is explicitly mentioned
const IRAN_KEYWORDS = [
  'iran', 'iranian', 'tehran', 'irgc', 'quds force', 'khamenei', 'strait of hormuz'
];

// --- NLP & SCORING ENGINE ---
function processText(text, sourceType) {
  const doc = nlp(text);
  
  // Isolate strictly geographic places for the location field
  let rawPlaces = [...new Set(doc.places().out('array'))];
  let places = rawPlaces
    .map(e => e.replace(/(['’]s|s['’])$/i, '').replace(/^(the|a|an)\s+/i, '').replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').trim())
    .filter(e => e.length > 2);

  // Extract other entities for actors
  let rawEntities = [...new Set([...doc.organizations().out('array'), ...doc.people().out('array')])];
  let entities = rawEntities
    .map(e => e.replace(/(['’]s|s['’])$/i, '').replace(/^(the|a|an)\s+/i, '').replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').trim())
    .filter(e => e.length > 2 || ['UN', 'US', 'UK', 'EU', 'IDF'].includes(e.toUpperCase()));

  let confidence = sourceType === 'Official' ? 10 : (sourceType === 'NGO' ? 9 : 8);
  let severity = text.toLowerCase().includes('dead') || text.toLowerCase().includes('strike') || text.toLowerCase().includes('attack') ? 8 : 4;

  return {
    location_text: places.length > 0 ? places[0] : 'Unknown', // Explicitly use places here
    actor_1: entities.length > 0 ? entities[0] : 'Unknown',
    actor_2: entities.length > 1 ? entities[1] : 'Unknown',
    confidence,
    severity
  };
}

// --- CATEGORY 1: NGO (ReliefWeb) ---
async function fetchNGO() {
  try {
    const response = await axios.get('https://api.reliefweb.int/v1/reports', {
      params: { appname: 'saig-test', 'query[value]': 'Iran OR Israel', preset: 'latest', limit: 15 },
      timeout: 5000
    });
    return response.data.data.map(item => {
      const p = processText(item.fields.title, 'NGO');
      return {
        event_datetime_utc: new Date(item.fields.date.created),
        source_name: 'ReliefWeb',
        source_url: item.fields.url,
        source_type: 'NGO',
        claim_text: item.fields.title,
        country: 'Middle East',
        location_text: p.location_text, 
        actor_1: p.actor_1, 
        actor_2: p.actor_2,
        event_type: 'Humanitarian Update',
        domain: 'Geopolitics',
        severity_score: p.severity,
        confidence_score: p.confidence,
        tags: ['NGO']
      };
    });
  } catch (e) { return []; }
}

// --- CATEGORY 2: OFFICIAL / IGO (UN News) ---
async function fetchOfficial() {
  try {
    const feed = await rssParser.parseURL('https://news.un.org/feed/subscribe/en/news/region/middle-east/feed/rss.xml');
    return feed.items.map(item => {
      const p = processText(item.title, 'Official');
      return {
        event_datetime_utc: new Date(item.pubDate),
        source_name: 'UN News',
        source_url: item.link,
        source_type: 'Official',
        claim_text: item.title,
        country: 'Middle East',
        location_text: p.location_text,
        actor_1: p.actor_1,
        actor_2: p.actor_2,
        event_type: 'Statement',
        domain: 'Diplomatic',
        severity_score: p.severity,
        confidence_score: p.confidence,
        tags: ['Official']
      };
    });
  } catch (e) { return []; }
}

// --- CATEGORY 3: NEWS MEDIA (Al Jazeera) ---
async function fetchNews() {
  try {
    const feed = await rssParser.parseURL('https://www.aljazeera.com/xml/rss/all.xml');
    return feed.items.map(item => {
      const p = processText(item.title, 'News');
      return {
        event_datetime_utc: new Date(item.pubDate),
        source_name: 'Al Jazeera',
        source_url: item.link,
        source_type: 'News',
        claim_text: item.title,
        country: 'Middle East',
        location_text: p.location_text,
        actor_1: p.actor_1,
        actor_2: p.actor_2,
        event_type: 'News Report',
        domain: 'General',
        severity_score: p.severity,
        confidence_score: p.confidence,
        tags: ['News']
      };
    });
  } catch (e) { return []; }
}

// --- CATEGORY 4: NEWS MEDIA (BBC Middle East) ---
async function fetchBBC() {
  try {
    const feed = await rssParser.parseURL('http://feeds.bbci.co.uk/news/world/middle_east/rss.xml');
    return feed.items.map(item => {
      const p = processText(item.title, 'News');
      return {
        event_datetime_utc: new Date(item.pubDate),
        source_name: 'BBC News',
        source_url: item.link,
        source_type: 'News',
        claim_text: item.title,
        country: 'Middle East',
        location_text: p.location_text,
        actor_1: p.actor_1,
        actor_2: p.actor_2,
        event_type: 'News Report',
        domain: 'General',
        severity_score: p.severity,
        confidence_score: p.confidence,
        tags: ['News']
      };
    });
  } catch (e) { return []; }
}

// --- CATEGORY 5: NEWS MEDIA (The Guardian) ---
async function fetchGuardian() {
  try {
    const feed = await rssParser.parseURL('https://www.theguardian.com/world/middleeast/rss');
    return feed.items.map(item => {
      const p = processText(item.title, 'News');
      return {
        event_datetime_utc: new Date(item.pubDate),
        source_name: 'The Guardian',
        source_url: item.link,
        source_type: 'News',
        claim_text: item.title,
        country: 'Middle East',
       location_text: p.location_text,
        actor_1: p.actor_1,
        actor_2: p.actor_2,
        event_type: 'News Report',
        domain: 'General',
        severity_score: p.severity,
        confidence_score: p.confidence,
        tags: ['News']
      };
    });
  } catch (e) { return []; }
}

// --- CATEGORY 6: NEWS MEDIA (New York Times Middle East) ---
async function fetchNYT() {
  try {
    const feed = await rssParser.parseURL('https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml');
    return feed.items.map(item => {
      const p = processText(item.title, 'News');
      return {
        event_datetime_utc: new Date(item.pubDate),
        source_name: 'New York Times',
        source_url: item.link,
        source_type: 'News',
        claim_text: item.title,
        country: 'Middle East',
        location_text: p.location_text,
        actor_1: p.actor_1,
        actor_2: p.actor_2,
        event_type: 'News Report',
        domain: 'General',
        severity_score: p.severity,
        confidence_score: p.confidence,
        tags: ['News']
      };
    });
  } catch (e) { return []; }
}

// --- CATEGORY 7: NEWS MEDIA (France 24 Middle East) ---
async function fetchFrance24() {
  try {
    const feed = await rssParser.parseURL('https://www.france24.com/en/middle-east/rss');
    return feed.items.map(item => {
      const p = processText(item.title, 'News');
      return {
        event_datetime_utc: new Date(item.pubDate),
        source_name: 'France 24',
        source_url: item.link,
        source_type: 'News',
        claim_text: item.title,
        country: 'Middle East',
        location_text: p.location_text,
        actor_1: p.actor_1,
        actor_2: p.actor_2,
        event_type: 'News Report',
        domain: 'General',
        severity_score: p.severity,
        confidence_score: p.confidence,
        tags: ['News']
      };
    });
  } catch (e) { return []; }
}

// --- CATEGORY 8: REGIONAL NEWS (Times of Israel) ---
async function fetchTOI() {
  try {
    const feed = await rssParser.parseURL('https://www.timesofisrael.com/feed/');
    return feed.items.map(item => {
      const p = processText(item.title, 'News');
      return {
        event_datetime_utc: new Date(item.pubDate),
        source_name: 'Times of Israel',
        source_url: item.link,
        source_type: 'News',
        claim_text: item.title,
        country: 'Middle East',
        location_text: p.location_text,
        actor_1: p.actor_1,
        actor_2: p.actor_2,
        event_type: 'News Report',
        domain: 'General',
        severity_score: p.severity,
        confidence_score: p.confidence,
        tags: ['News']
      };
    });
  } catch (e) { return []; }
}

// --- MAIN EXECUTION ---
async function runPipeline() {
  await connectDB();
  console.log('Fetching OSINT data from 8 sources and extracting actors via NLP...');
  
  // 1. Fetch from all 8 sources concurrently
  const [ngo, official, news, bbc, guardian, nyt, f24, toi] = await Promise.all([
    fetchNGO(), fetchOfficial(), fetchNews(), fetchBBC(), fetchGuardian(), fetchNYT(), fetchFrance24(), fetchTOI()
  ]);
  
  // Combine all 8 arrays
  const allEvents = [...ngo, ...official, ...news, ...bbc, ...guardian, ...nyt, ...f24, ...toi];

  // 2. STRICT FILTER: Keep only events mentioning US, Israel, Iran, or key proxies
  const relevantEvents = allEvents.filter(event => {
    const text = event.claim_text.toLowerCase();
    
    // The article MUST contain at least one Iran-specific keyword to be saved
    return IRAN_KEYWORDS.some(keyword => text.includes(keyword));
  });

  // 3. Insert into Database
  let added = 0;
  for (const event of relevantEvents) {
    try {
      const result = await Event.updateOne(
        { source_url: event.source_url },
        { $set: event },
        { upsert: true }
      );
      if (result.upsertedCount > 0) added++;
    } catch (e) {}
  }

  console.log(`Pipeline complete. Scraped ${allEvents.length} total events. Retained ${relevantEvents.length} relevant events.`);
  console.log(`Inserted ${added} new dynamically parsed events into DB.`);
  process.exit();
}

runPipeline();