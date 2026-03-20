
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually parse .env file
const envPath = path.resolve(__dirname, '../.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.join('=').trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const countries = [
  { name: "United Kingdom", description: "A sovereign country in northwestern Europe, known for its rich history and influential culture.", 
    details: { official_name: "United Kingdom of Great Britain and Northern Ireland", capital: "London", continents: ["Europe"], latlng: [55.3781, -3.436], area: 242495, population: 67000000, flag_url: "https://flagcdn.com/w320/gb.png", card_image_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000", languages: ["English"], currency: { name: "British Pound", symbol: "£", code: "GBP" } } },
  { name: "Canada", description: "A North American country known for its vast natural landscapes and high quality of life.", 
    details: { official_name: "Canada", capital: "Ottawa", continents: ["North America"], latlng: [56.1304, -106.3468], area: 9984670, population: 38000000, flag_url: "https://flagcdn.com/w320/ca.png", card_image_url: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?q=80&w=1000", languages: ["English", "French"], currency: { name: "Canadian Dollar", symbol: "$", code: "CAD" } } },
  { name: "Australia", description: "A massive island continent and country known for its unique wildlife and beautiful beaches.", 
    details: { official_name: "Commonwealth of Australia", capital: "Canberra", continents: ["Oceania"], latlng: [-25.2744, 133.7751], area: 7692024, population: 25700000, flag_url: "https://flagcdn.com/w320/au.png", card_image_url: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1000", languages: ["English"], currency: { name: "Australian Dollar", symbol: "$", code: "AUD" } } },
  { name: "Germany", description: "A major European power known for its engineering, history, and vibrant cities.", 
    details: { official_name: "Federal Republic of Germany", capital: "Berlin", continents: ["Europe"], latlng: [51.1657, 10.4515], area: 357022, population: 83000000, flag_url: "https://flagcdn.com/w320/de.png", card_image_url: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1000", languages: ["German"], currency: { name: "Euro", symbol: "€", code: "EUR" } } },
  { name: "Japan", description: "An island nation in East Asia known for its technology, culture, and cuisine.", 
    details: { official_name: "Japan", capital: "Tokyo", continents: ["Asia"], latlng: [36.2048, 138.2529], area: 377975, population: 125800000, flag_url: "https://flagcdn.com/w320/jp.png", card_image_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000", languages: ["Japanese"], currency: { name: "Japanese Yen", symbol: "¥", code: "JPY" } } },
  { name: "France", description: "A country in Western Europe famous for its art, fashion, and gastronomy.", 
    details: { official_name: "French Republic", capital: "Paris", continents: ["Europe"], latlng: [46.2276, 2.2137], area: 643801, population: 67400000, flag_url: "https://flagcdn.com/w320/fr.png", card_image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000", languages: ["French"], currency: { name: "Euro", symbol: "€", code: "EUR" } } },
  { name: "United States", description: "A large North American nation known for its global influence and diverse geography.", 
    details: { official_name: "United States of America", capital: "Washington, D.C.", continents: ["North America"], latlng: [37.0902, -95.7129], area: 9833517, population: 331000000, flag_url: "https://flagcdn.com/w320/us.png", card_image_url: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=1000", languages: ["English"], currency: { name: "US Dollar", symbol: "$", code: "USD" } } },
  { name: "India", description: "The world's most populous country, known for its ancient civilization and diverse culture.", 
    details: { official_name: "Republic of India", capital: "New Delhi", continents: ["Asia"], latlng: [20.5937, 78.9629], area: 3287263, population: 1400000000, flag_url: "https://flagcdn.com/w320/in.png", card_image_url: "https://images.unsplash.com/photo-1524492707947-5c17983ea1c5?q=80&w=1000", languages: ["Hindi", "English"], currency: { name: "Indian Rupee", symbol: "₹", code: "INR" } } },
  { name: "New Zealand", description: "Known for its stunning natural beauty and adventurous spirit.", 
    details: { official_name: "New Zealand", capital: "Wellington", continents: ["Oceania"], latlng: [-40.9006, 174.8860], area: 268021, population: 5100000, flag_url: "https://flagcdn.com/w320/nz.png", card_image_url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000", languages: ["English", "Māori"], currency: { name: "New Zealand Dollar", symbol: "$", code: "NZD" } } },
  { name: "Switzerland", description: "A landlocked country in Europe known for its neutrality, Alps, and banking.", 
    details: { official_name: "Swiss Confederation", capital: "Bern", continents: ["Europe"], latlng: [46.8182, 8.2275], area: 41285, population: 8600000, flag_url: "https://flagcdn.com/w320/ch.png", card_image_url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1000", languages: ["German", "French", "Italian", "Romansh"], currency: { name: "Swiss Franc", symbol: "CHF", code: "CHF" } } },
  { name: "Singapore", description: "A global financial hub and island city-state in Southeast Asia.", 
    details: { official_name: "Republic of Singapore", capital: "Singapore", continents: ["Asia"], latlng: [1.3521, 103.8198], area: 728, population: 5700000, flag_url: "https://flagcdn.com/w320/sg.png", card_image_url: "https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?q=80&w=1000", languages: ["English", "Malay", "Mandarin", "Tamil"], currency: { name: "Singapore Dollar", symbol: "$", code: "SGD" } } },
  { name: "Italy", description: "Known for its rich history, art, and world-class food.", 
    details: { official_name: "Italian Republic", capital: "Rome", continents: ["Europe"], latlng: [41.8719, 12.5674], area: 301340, population: 60000000, flag_url: "https://flagcdn.com/w320/it.png", card_image_url: "https://images.unsplash.com/photo-1529243856184-fd5465488984?q=80&w=1000", languages: ["Italian"], currency: { name: "Euro", symbol: "€", code: "EUR" } } },
  { name: "Spain", description: "A vibrant country on the Iberian Peninsula known for its culture and beaches.", 
    details: { official_name: "Kingdom of Spain", capital: "Madrid", continents: ["Europe"], latlng: [40.4637, -3.7492], area: 505992, population: 47000000, flag_url: "https://flagcdn.com/w320/es.png", card_image_url: "https://images.unsplash.com/photo-1543783232-05740439d5e3?q=80&w=1000", languages: ["Spanish"], currency: { name: "Euro", symbol: "€", code: "EUR" } } },
  { name: "Netherlands", description: "Known for its flat landscape, canals, and liberal policies.", 
    details: { official_name: "Kingdom of the Netherlands", capital: "Amsterdam", continents: ["Europe"], latlng: [52.1326, 5.2913], area: 41543, population: 17400000, flag_url: "https://flagcdn.com/w320/nl.png", card_image_url: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=1000", languages: ["Dutch"], currency: { name: "Euro", symbol: "€", code: "EUR" } } },
  { name: "Sweden", description: "A Scandinavian nation known for its social welfare system and innovation.", 
    details: { official_name: "Kingdom of Sweden", capital: "Stockholm", continents: ["Europe"], latlng: [60.1282, 18.6435], area: 450295, population: 10300000, flag_url: "https://flagcdn.com/w320/se.png", card_image_url: "https://images.unsplash.com/photo-1509339022327-1e1e25360a41?q=80&w=1000", languages: ["Swedish"], currency: { name: "Swedish Krona", symbol: "kr", code: "SEK" } } },
  { name: "Norway", description: "Famous for its fjords, mountains, and high standard of living.", 
    details: { official_name: "Kingdom of Norway", capital: "Oslo", continents: ["Europe"], latlng: [60.4720, 8.4689], area: 385207, population: 5400000, flag_url: "https://flagcdn.com/w320/no.png", card_image_url: "https://images.unsplash.com/photo-1513519107127-1bed33748e4c?q=80&w=1000", languages: ["Norwegian"], currency: { name: "Norwegian Krone", symbol: "kr", code: "NOK" } } },
  { name: "United Arab Emirates", description: "A country in the Middle East known for its rapid development and luxury.", 
    details: { official_name: "United Arab Emirates", capital: "Abu Dhabi", continents: ["Asia"], latlng: [23.4241, 53.8478], area: 83600, population: 9900000, flag_url: "https://flagcdn.com/w320/ae.png", card_image_url: "https://images.unsplash.com/photo-1512453979798-5ea234f8876a?q=80&w=1000", languages: ["Arabic"], currency: { name: "UAE Dirham", symbol: "د.إ", code: "AED" } } },
  { name: "South Korea", description: "Known for its technological leadership, pop culture, and dynamic economy.", 
    details: { official_name: "Republic of Korea", capital: "Seoul", continents: ["Asia"], latlng: [35.9078, 127.7669], area: 100210, population: 51800000, flag_url: "https://flagcdn.com/w320/kr.png", card_image_url: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1000", languages: ["Korean"], currency: { name: "South Korean Won", symbol: "₩", code: "KRW" } } },
  { name: "Brazil", description: "The largest country in South America, known for the Amazon and vibrant culture.", 
    details: { official_name: "Federative Republic of Brazil", capital: "Brasília", continents: ["South America"], latlng: [-14.2350, -51.9253], area: 8515767, population: 212600000, flag_url: "https://flagcdn.com/w320/br.png", card_image_url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1000", languages: ["Portuguese"], currency: { name: "Brazilian Real", symbol: "R$", code: "BRL" } } },
  { name: "Ireland", description: "The Emerald Isle, known for its lush landscapes and rich folklore.", 
    details: { official_name: "Republic of Ireland", capital: "Dublin", continents: ["Europe"], latlng: [53.4129, -8.2439], area: 70273, population: 4900000, flag_url: "https://flagcdn.com/w320/ie.png", card_image_url: "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?q=80&w=1000", languages: ["Irish", "English"], currency: { name: "Euro", symbol: "€", code: "EUR" } } },
  { name: "Portugal", description: "A coastal European country known for its history, wine, and culture.", 
    details: { official_name: "Portuguese Republic", capital: "Lisbon", continents: ["Europe"], latlng: [39.3999, -8.2245], area: 92090, population: 10300000, flag_url: "https://flagcdn.com/w320/pt.png", card_image_url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=1000", languages: ["Portuguese"], currency: { name: "Euro", symbol: "€", code: "EUR" } } },
  { name: "Denmark", description: "Known for its flat terrain, wind power, and high quality of life.", 
    details: { official_name: "Kingdom of Denmark", capital: "Copenhagen", continents: ["Europe"], latlng: [56.2639, 9.5018], area: 43094, population: 5800000, flag_url: "https://flagcdn.com/w320/dk.png", card_image_url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000", languages: ["Danish"], currency: { name: "Danish Krone", symbol: "kr", code: "DKK" } } },
  { name: "Finland", description: "Known as the happiest country in the world, famous for its nature and education.", 
    details: { official_name: "Republic of Finland", capital: "Helsinki", continents: ["Europe"], latlng: [61.9241, 25.7482], area: 338424, population: 5500000, flag_url: "https://flagcdn.com/w320/fi.png", card_image_url: "https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?q=80&w=1000", languages: ["Finnish", "Swedish"], currency: { name: "Euro", symbol: "€", code: "EUR" } } },
  { name: "Austria", description: "A landlocked Alpine country known for its music and architecture.", 
    details: { official_name: "Republic of Austria", capital: "Vienna", continents: ["Europe"], latlng: [47.5162, 14.5501], area: 83871, population: 8900000, flag_url: "https://flagcdn.com/w320/at.png", card_image_url: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=1000", languages: ["German"], currency: { name: "Euro", symbol: "€", code: "EUR" } } },
  { name: "Belgium", description: "Known for its chocolates, waffles, and being the heart of the EU.", 
    details: { official_name: "Kingdom of Belgium", capital: "Brussels", continents: ["Europe"], latlng: [50.5039, 4.4699], area: 30528, population: 11500000, flag_url: "https://flagcdn.com/w320/be.png", card_image_url: "https://images.unsplash.com/photo-1491557345352-5929e343d40e?q=80&w=1000", languages: ["Dutch", "French", "German"], currency: { name: "Euro", symbol: "€", code: "EUR" } } },
  { name: "Greece", description: "The cradle of Western civilization, known for its islands and history.", 
    details: { official_name: "Hellenic Republic", capital: "Athens", continents: ["Europe"], latlng: [39.0742, 21.8243], area: 131957, population: 10700000, flag_url: "https://flagcdn.com/w320/gr.png", card_image_url: "https://images.unsplash.com/photo-1503152397458-9962b774fb3a?q=80&w=1000", languages: ["Greek"], currency: { name: "Euro", symbol: "€", code: "EUR" } } },
  { name: "Turkey", description: "A transcontinental country between Europe and Asia with a rich history.", 
    details: { official_name: "Republic of Turkey", capital: "Ankara", continents: ["Asia", "Europe"], latlng: [38.9637, 35.2433], area: 783356, population: 84300000, flag_url: "https://flagcdn.com/w320/tr.png", card_image_url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=1000", languages: ["Turkish"], currency: { name: "Turkish Lira", symbol: "₺", code: "TRY" } } },
  { name: "Thailand", description: "A vibrant country in Southeast Asia known for its temples and beaches.", 
    details: { official_name: "Kingdom of Thailand", capital: "Bangkok", continents: ["Asia"], latlng: [15.8700, 100.9925], area: 513120, population: 69800000, flag_url: "https://flagcdn.com/w320/th.png", card_image_url: "https://images.unsplash.com/photo-1528181304800-2f140819ad9c?q=80&w=1000", languages: ["Thai"], currency: { name: "Thai Baht", symbol: "฿", code: "THB" } } },
  { name: "Mexico", description: "Known for its culture, food, and historical sites.", 
    details: { official_name: "United Mexican States", capital: "Mexico City", continents: ["North America"], latlng: [23.6345, -102.5528], area: 1964375, population: 128900000, flag_url: "https://flagcdn.com/w320/mx.png", card_image_url: "https://images.unsplash.com/photo-1518105779142-d975fb19a65f?q=80&w=1000", languages: ["Spanish"], currency: { name: "Mexican Peso", symbol: "$", code: "MXN" } } },
  { name: "South Africa", description: "A diverse country known for its landscapes and wildlife.", 
    details: { official_name: "Republic of South Africa", capital: "Pretoria", continents: ["Africa"], latlng: [-30.5595, 22.9375], area: 1221037, population: 59300000, flag_url: "https://flagcdn.com/w320/za.png", card_image_url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000", languages: ["11 official languages"], currency: { name: "South African Rand", symbol: "R", code: "ZAR" } } }
];

async function seed() {
  console.log("Starting seed process...");
  
  for (const country of countries) {
    try {
      console.log(`Processing ${country.name}...`);
      
      // UPSERT country
      const { data: countryRow, error: countryErr } = await supabase
        .from('countries')
        .upsert({
          name: country.name,
          description: country.description,
          is_blocked: false,
          is_approved: 'approved'
        }, { onConflict: 'name' })
        .select()
        .single();
        
      if (countryErr) throw countryErr;
      
      // UPSERT country_details
      const { error: detailsErr } = await supabase
        .from('country_details')
        .upsert({
          country_id: countryRow.id,
          official_name: country.details.official_name,
          capital: country.details.capital,
          continents: country.details.continents,
          latlng: country.details.latlng,
          area: country.details.area,
          population: country.details.population,
          flag_url: country.details.flag_url,
          banner_url: country.details.card_image_url,
          languages: country.details.languages,
          currency: country.details.currency,
          zoom: 5
        }, { onConflict: 'country_id' });
        
      if (detailsErr) throw detailsErr;
      
      console.log(`Successfully added/updated ${country.name}`);
    } catch (err) {
      console.error(`Error processing ${country.name}:`, err.message);
    }
  }
  
  console.log("Seeding completed!");
}

seed();
