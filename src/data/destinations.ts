// Rich destination data with real attractions, images, hotels, and coordinates

export interface DestinationPlace {
  name: string;
  description: string;
  time: string; // e.g. "9:00 AM"
  period: 'morning' | 'afternoon' | 'evening';
  image: string;
  lat: number;
  lng: number;
}

export interface DestinationDay {
  title: string;     // e.g. "Tokyo Highlights"
  subtitle: string;  // e.g. "Iconic landmarks & city vibes"
  places: DestinationPlace[];
}

export interface DestinationHotel {
  name: string;
  area: string;
  rating: number;
  pricePerNight: number;
  image: string;
  style: string; // luxury, mid-range, budget
}

export interface DestinationInfo {
  center: [number, number];
  currency: string;
  hotels: DestinationHotel[];
  days: DestinationDay[];
}

// Unsplash direct photo links for real imagery
const DESTINATIONS: Record<string, DestinationInfo> = {
  japan: {
    center: [35.6762, 139.6503],
    currency: '¥',
    hotels: [
      { name: 'Park Hyatt Tokyo', area: 'Shinjuku', rating: 4.9, pricePerNight: 450, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', style: 'luxury' },
      { name: 'Hotel Gracery Shinjuku', area: 'Kabukicho', rating: 4.6, pricePerNight: 180, image: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c11?w=600', style: 'mid-range' },
      { name: 'Sakura Hotel Ikebukuro', area: 'Ikebukuro', rating: 4.2, pricePerNight: 65, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600', style: 'budget' },
    ],
    days: [
      {
        title: 'Tokyo Tower & Shibuya',
        subtitle: 'Iconic landmarks & neon-lit streets',
        places: [
          { name: 'Meiji Shrine', description: 'Start your morning at this serene Shinto shrine nestled in a lush forest in the heart of Tokyo.', time: '8:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1583766395091-2eb9994ed094?w=600', lat: 35.6764, lng: 139.6993 },
          { name: 'Shibuya Crossing & Hachiko', description: 'Experience the world\'s busiest pedestrian crossing and pay respects at the famous Hachiko statue.', time: '1:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600', lat: 35.6595, lng: 139.7004 },
          { name: 'Tokyo Tower Night View', description: 'Watch the city light up from the observation deck of the iconic 333m tower.', time: '6:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600', lat: 35.6586, lng: 139.7454 },
        ]
      },
      {
        title: 'Asakusa & Akihabara',
        subtitle: 'Ancient temples meet anime culture',
        places: [
          { name: 'Senso-ji Temple', description: 'Tokyo\'s oldest temple with the iconic Thunder Gate and Nakamise shopping street.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600', lat: 35.7148, lng: 139.7967 },
          { name: 'Akihabara Electric Town', description: 'Dive into Japan\'s anime, manga, and electronics paradise district.', time: '2:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600', lat: 35.7023, lng: 139.7745 },
          { name: 'Sumida River Cruise', description: 'Relaxing evening cruise along the Sumida River with views of illuminated bridges.', time: '6:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600', lat: 35.7100, lng: 139.8000 },
        ]
      },
      {
        title: 'Mount Fuji Day Trip',
        subtitle: 'Japan\'s highest peak & surrounding lakes',
        places: [
          { name: 'Mount Fuji 5th Station', description: 'Journey to the iconic 5th station at 2,300m altitude for breathtaking panoramic views.', time: '7:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600', lat: 35.3606, lng: 138.7274 },
          { name: 'Lake Kawaguchiko', description: 'Stroll around the scenic lake with mirror-like reflections of Mount Fuji.', time: '1:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?w=600', lat: 35.5161, lng: 138.7528 },
          { name: 'Oshino Hakkai Village', description: 'Charming village with crystal-clear spring ponds fed by Mount Fuji snowmelt.', time: '5:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=600', lat: 35.4600, lng: 138.8400 },
        ]
      },
      {
        title: 'Kyoto Temples & Gardens',
        subtitle: 'Thousand-year-old cultural treasures',
        places: [
          { name: 'Fushimi Inari Shrine', description: 'Walk through thousands of vibrant orange torii gates winding up the sacred mountain.', time: '8:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=600', lat: 34.9671, lng: 135.7727 },
          { name: 'Kinkaku-ji Golden Pavilion', description: 'The dazzling gold-leaf-covered zen temple reflected perfectly in its pond.', time: '1:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600', lat: 35.0394, lng: 135.7292 },
          { name: 'Gion Geisha District', description: 'Evening stroll through Kyoto\'s famous geisha quarter with traditional wooden teahouses.', time: '6:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600', lat: 35.0037, lng: 135.7754 },
        ]
      },
      {
        title: 'Nara & Bamboo Forest',
        subtitle: 'Friendly deer & ethereal bamboo groves',
        places: [
          { name: 'Arashiyama Bamboo Grove', description: 'Walk through the magical towering bamboo forest that sways gently in the wind.', time: '8:30 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600', lat: 35.0094, lng: 135.6737 },
          { name: 'Nara Deer Park', description: 'Feed and interact with over 1,000 sacred deer that roam freely in this ancient park.', time: '1:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600', lat: 34.6851, lng: 135.8430 },
          { name: 'Todai-ji Temple', description: 'Home to the world\'s largest bronze Buddha statue inside a massive wooden hall.', time: '5:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?w=600', lat: 34.6890, lng: 135.8399 },
        ]
      },
      {
        title: 'Osaka Food Capital',
        subtitle: 'Street food heaven & vibrant nightlife',
        places: [
          { name: 'Osaka Castle', description: 'Explore the magnificent 16th-century castle surrounded by cherry-blossom gardens.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=600', lat: 34.6873, lng: 135.5262 },
          { name: 'Dotonbori Street Food Tour', description: 'Devour iconic takoyaki, okonomiyaki, and gyoza along the neon-lit canal street.', time: '12:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600', lat: 34.6687, lng: 135.5031 },
          { name: 'Shinsekai & Tsutenkaku Tower', description: 'Retro entertainment district with the glowing Tsutenkaku Tower and local kushikatsu.', time: '6:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=600', lat: 34.6525, lng: 135.5063 },
        ]
      },
      {
        title: 'Hiroshima Peace & Island',
        subtitle: 'History, remembrance & floating shrine',
        places: [
          { name: 'Hiroshima Peace Memorial', description: 'Pay tribute at the A-Bomb Dome and walk through the moving Peace Memorial Museum.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=600', lat: 34.3955, lng: 132.4536 },
          { name: 'Miyajima Island', description: 'Ferry to the sacred island and see the iconic floating torii gate of Itsukushima Shrine.', time: '1:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1505440484611-23c171ad6e96?w=600', lat: 34.2960, lng: 132.3198 },
          { name: 'Momijidani Park Sunset', description: 'End the trip at this beautiful maple valley park as the sun sets behind the pagoda.', time: '5:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=600', lat: 34.2990, lng: 132.3215 },
        ]
      },
    ],
  },

  paris: {
    center: [48.8566, 2.3522],
    currency: '€',
    hotels: [
      { name: 'Le Meurice', area: 'Tuileries', rating: 4.9, pricePerNight: 520, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', style: 'luxury' },
      { name: 'Hotel du Petit Moulin', area: 'Le Marais', rating: 4.5, pricePerNight: 200, image: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c11?w=600', style: 'mid-range' },
      { name: 'Generator Paris', area: 'Canal Saint-Martin', rating: 4.1, pricePerNight: 55, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600', style: 'budget' },
    ],
    days: [
      {
        title: 'Eiffel Tower & Champs-Élysées',
        subtitle: 'Iconic Parisian landmarks & boulevard',
        places: [
          { name: 'Eiffel Tower', description: 'Ascend the iron lady of Paris for unmatched panoramic views stretching across the entire city.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=600', lat: 48.8584, lng: 2.2945 },
          { name: 'Champs-Élysées & Arc de Triomphe', description: 'Stroll the world\'s most famous avenue and climb the arc for a unique city panorama.', time: '1:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=600', lat: 48.8738, lng: 2.2950 },
          { name: 'Seine River Dinner Cruise', description: 'Glide past illuminated monuments on an enchanting evening dinner cruise.', time: '7:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600', lat: 48.8600, lng: 2.3200 },
        ]
      },
      {
        title: 'Louvre & Notre-Dame',
        subtitle: 'Art masterpieces & Gothic grandeur',
        places: [
          { name: 'Louvre Museum', description: 'Explore the world\'s largest art museum housing the Mona Lisa and Venus de Milo.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?w=600', lat: 48.8606, lng: 2.3376 },
          { name: 'Notre-Dame Cathedral', description: 'Marvel at the Gothic masterpiece on the Île de la Cité, a symbol of Paris for 800 years.', time: '2:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=600', lat: 48.8530, lng: 2.3499 },
          { name: 'Le Marais Evening Walk', description: 'Explore the trendy neighborhood with boutiques, galleries, and charming cafés.', time: '6:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', lat: 48.8598, lng: 2.3620 },
        ]
      },
      {
        title: 'Montmartre & Sacré-Cœur',
        subtitle: 'Artistic hilltop & bohemian charm',
        places: [
          { name: 'Sacré-Cœur Basilica', description: 'Climb to the white-domed hilltop church for the best sunrise views in Paris.', time: '8:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=600', lat: 48.8867, lng: 2.3431 },
          { name: 'Place du Tertre Artists Square', description: 'Watch painters create masterpieces in this legendary artistic square.', time: '12:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600', lat: 48.8863, lng: 2.3408 },
          { name: 'Moulin Rouge Show', description: 'Catch the legendary cabaret performance in Montmartre\'s iconic windmill venue.', time: '8:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=600', lat: 48.8841, lng: 2.3323 },
        ]
      },
      {
        title: 'Versailles Day Trip',
        subtitle: 'Royal palace & infinite gardens',
        places: [
          { name: 'Palace of Versailles', description: 'Tour the opulent Hall of Mirrors and grand state apartments of the Sun King.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1551410224-699683e15636?w=600', lat: 48.8049, lng: 2.1204 },
          { name: 'Versailles Gardens', description: 'Wander through the perfectly manicured 800-hectare gardens with musical fountains.', time: '1:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1553659971-f01207815844?w=600', lat: 48.8040, lng: 2.1100 },
          { name: 'Marie Antoinette\'s Estate', description: 'Visit the queen\'s private hamlet and Petit Trianon palace.', time: '4:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600', lat: 48.8100, lng: 2.1200 },
        ]
      },
      {
        title: 'Latin Quarter & Luxembourg',
        subtitle: 'Intellectual heart & serene gardens',
        places: [
          { name: 'Luxembourg Gardens', description: 'Relax in Paris\'s most beautiful garden with fountains, sculptures, and Parisian charm.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1470858831619-ca02d796b2a5?w=600', lat: 48.8462, lng: 2.3372 },
          { name: 'Shakespeare & Company Bookshop', description: 'Browse the legendary English-language bookstore across from Notre-Dame since 1951.', time: '1:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', lat: 48.8526, lng: 2.3472 },
          { name: 'Panthéon & Latin Quarter Dinner', description: 'Visit the neoclassical monument and enjoy authentic French cuisine in the student quarter.', time: '6:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=600', lat: 48.8463, lng: 2.3461 },
        ]
      },
    ]
  },

  dubai: {
    center: [25.2048, 55.2708],
    currency: 'AED',
    hotels: [
      { name: 'Burj Al Arab', area: 'Jumeirah', rating: 4.9, pricePerNight: 1200, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', style: 'luxury' },
      { name: 'Rove Downtown', area: 'Downtown', rating: 4.4, pricePerNight: 120, image: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c11?w=600', style: 'mid-range' },
      { name: 'Premier Inn Ibn Battuta', area: 'Jebel Ali', rating: 4.0, pricePerNight: 55, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600', style: 'budget' },
    ],
    days: [
      {
        title: 'Burj Khalifa & Downtown',
        subtitle: 'World\'s tallest tower & dancing fountains',
        places: [
          { name: 'Burj Khalifa At The Top', description: 'Ride the world\'s fastest elevator to the 148th floor for views spanning 95km.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', lat: 25.1972, lng: 55.2744 },
          { name: 'Dubai Mall & Aquarium', description: 'Explore the world\'s largest mall with a 10-million-liter indoor aquarium.', time: '1:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600', lat: 25.1985, lng: 55.2796 },
          { name: 'Dubai Fountain Show', description: 'Watch the mesmerizing choreographed fountain show set to Arabic and international music.', time: '7:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600', lat: 25.1953, lng: 55.2750 },
        ]
      },
      {
        title: 'Desert Safari Adventure',
        subtitle: 'Dune bashing & Bedouin culture',
        places: [
          { name: 'Morning Desert Dune Bashing', description: 'Thrilling 4x4 ride across golden sand dunes in the Arabian Desert.', time: '8:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=600', lat: 25.0500, lng: 55.4000 },
          { name: 'Camel Ride & Sandboarding', description: 'Ride camels across the dunes and try sandboarding down steep slopes.', time: '2:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=600', lat: 25.0400, lng: 55.4100 },
          { name: 'Bedouin Camp & BBQ Dinner', description: 'Traditional belly dance, henna painting, and an authentic BBQ under the stars.', time: '6:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=600', lat: 25.0450, lng: 55.4050 },
        ]
      },
      {
        title: 'Palm Jumeirah & Marina',
        subtitle: 'Man-made island & luxury waterfront',
        places: [
          { name: 'Atlantis Aquaventure Waterpark', description: 'World-class waterpark on the tip of the Palm with record-breaking slides.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600', lat: 25.1304, lng: 55.1172 },
          { name: 'Palm Jumeirah Monorail', description: 'Ride the monorail across the palm-shaped island with stunning aerial views.', time: '2:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', lat: 25.1123, lng: 55.1390 },
          { name: 'Dubai Marina Walk & Dinner', description: 'Evening walk along the glamorous marina with yacht views and waterfront dining.', time: '6:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600', lat: 25.0804, lng: 55.1403 },
        ]
      },
      {
        title: 'Old Dubai Heritage Tour',
        subtitle: 'Gold souks, spice markets & creek crossings',
        places: [
          { name: 'Gold & Spice Souk', description: 'Browse dazzling gold jewelry and aromatic spices in Dubai\'s historic trading district.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=600', lat: 25.2867, lng: 55.2974 },
          { name: 'Abra Ride across Dubai Creek', description: 'Traditional wooden boat ride across the creek connecting old and new Dubai.', time: '12:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=600', lat: 25.2637, lng: 55.2965 },
          { name: 'Al Fahidi Historical District', description: 'Wander through restored wind-tower houses turned into art galleries and cafés.', time: '4:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=600', lat: 25.2636, lng: 55.2989 },
        ]
      },
      {
        title: 'Abu Dhabi Day Trip',
        subtitle: 'Grand Mosque & cultural capital',
        places: [
          { name: 'Sheikh Zayed Grand Mosque', description: 'Visit one of the world\'s largest and most beautiful mosques with 82 marble domes.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', lat: 24.4128, lng: 54.4750 },
          { name: 'Louvre Abu Dhabi', description: 'Explore the stunning floating museum showcasing art from across civilizations.', time: '1:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600', lat: 24.5339, lng: 54.3983 },
          { name: 'Corniche Beach Sunset', description: 'Relax at the beautiful 8km Corniche waterfront as the sun sets over the Gulf.', time: '5:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600', lat: 24.4764, lng: 54.3549 },
        ]
      },
    ]
  },

  bali: {
    center: [-8.3405, 115.0920],
    currency: 'IDR',
    hotels: [
      { name: 'Four Seasons Sayan', area: 'Ubud', rating: 4.9, pricePerNight: 380, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', style: 'luxury' },
      { name: 'Bisma Eight', area: 'Ubud', rating: 4.6, pricePerNight: 130, image: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c11?w=600', style: 'mid-range' },
      { name: 'Capsule Hotel Bali', area: 'Seminyak', rating: 4.0, pricePerNight: 25, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600', style: 'budget' },
    ],
    days: [
      {
        title: 'Ubud Rice Terraces & Temples',
        subtitle: 'Emerald paddies & sacred monkeys',
        places: [
          { name: 'Tegallalang Rice Terraces', description: 'Walk through Bali\'s most stunning cascading rice terraces carved into the hillside.', time: '8:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', lat: -8.4312, lng: 115.2792 },
          { name: 'Sacred Monkey Forest', description: 'Explore the mystical forest sanctuary home to over 700 long-tailed macaques.', time: '1:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', lat: -8.5186, lng: 115.2588 },
          { name: 'Ubud Palace Night Performance', description: 'Watch a mesmerizing traditional Balinese Kecak fire dance at the royal palace.', time: '7:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=600', lat: -8.5069, lng: 115.2625 },
        ]
      },
      {
        title: 'Uluwatu Cliffs & Beaches',
        subtitle: 'Dramatic clifftop temples & surf',
        places: [
          { name: 'Uluwatu Temple', description: 'Visit the ancient clifftop temple perched 70m above the crashing Indian Ocean waves.', time: '8:30 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', lat: -8.8291, lng: 115.0849 },
          { name: 'Padang Padang Beach', description: 'Relax at the famous hidden beach accessed through a narrow cave in the cliffs.', time: '1:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', lat: -8.8114, lng: 115.0963 },
          { name: 'Uluwatu Kecak Dance at Sunset', description: 'Spectacular fire dance performance on the clifftop with the ocean sunset as backdrop.', time: '6:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=600', lat: -8.8300, lng: 115.0860 },
        ]
      },
      {
        title: 'Waterfalls & Coffee Tour',
        subtitle: 'Hidden cascades & Luwak coffee tasting',
        places: [
          { name: 'Tegenungan Waterfall', description: 'Swim in the refreshing pool beneath this powerful 25m waterfall surrounded by jungle.', time: '8:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', lat: -8.5752, lng: 115.2890 },
          { name: 'Luwak Coffee Plantation', description: 'Taste the world\'s most expensive coffee and learn about Bali\'s unique coffee process.', time: '12:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', lat: -8.4400, lng: 115.2800 },
          { name: 'Tirta Empul Water Temple', description: 'Join locals in the sacred purification ritual at this holy spring water temple.', time: '4:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=600', lat: -8.4153, lng: 115.3155 },
        ]
      },
      {
        title: 'Nusa Penida Island',
        subtitle: 'Dramatic cliffs & manta rays',
        places: [
          { name: 'Kelingking Beach (T-Rex Cliff)', description: 'The famous dinosaur-shaped cliff with turquoise waters — Bali\'s most Instagrammed spot.', time: '7:30 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', lat: -8.7461, lng: 115.4671 },
          { name: 'Angel\'s Billabong & Broken Beach', description: 'Natural infinity pool and dramatic rock arch over the ocean.', time: '1:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', lat: -8.7359, lng: 115.4875 },
          { name: 'Crystal Bay Snorkeling', description: 'Snorkel in crystal-clear waters with manta rays and vibrant coral reefs.', time: '4:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=600', lat: -8.7222, lng: 115.4555 },
        ]
      },
      {
        title: 'Seminyak Beach & Spa Day',
        subtitle: 'Luxury beach clubs & Balinese wellness',
        places: [
          { name: 'Seminyak Beach Sunrise Yoga', description: 'Start with a peaceful beachfront yoga session as the sun rises over the ocean.', time: '6:30 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', lat: -8.6894, lng: 115.1600 },
          { name: 'Potato Head Beach Club', description: 'Spend the afternoon at Bali\'s most iconic beach club with pools and cocktails.', time: '12:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600', lat: -8.6850, lng: 115.1520 },
          { name: 'Traditional Balinese Spa', description: 'Luxurious 2-hour flower bath and massage treatment to end your Bali journey.', time: '5:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=600', lat: -8.6900, lng: 115.1650 },
        ]
      },
    ]
  },

  jaipur: {
    center: [26.9124, 75.7873],
    currency: '₹',
    hotels: [
      { name: 'Rambagh Palace', area: 'C-Scheme', rating: 4.9, pricePerNight: 350, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', style: 'luxury' },
      { name: 'Hotel Pearl Palace', area: 'Hathroi', rating: 4.5, pricePerNight: 40, image: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c11?w=600', style: 'mid-range' },
      { name: 'Zostel Jaipur', area: 'Pink City', rating: 4.2, pricePerNight: 12, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600', style: 'budget' },
    ],
    days: [
      {
        title: 'Amber Fort & City Palace',
        subtitle: 'Royal Rajputana grandeur',
        places: [
          { name: 'Amber Fort', description: 'Majestic hilltop fort with stunning mirror palace, elephant rides, and panoramic views.', time: '8:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', lat: 26.9855, lng: 75.8513 },
          { name: 'City Palace', description: 'Explore the royal residence blending Rajasthani and Mughal architecture.', time: '1:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1524309349498-b5be4ba878c8?w=600', lat: 26.9258, lng: 75.8237 },
          { name: 'Nahargarh Fort Sunset', description: 'Watch the pink city glow golden from the ramparts of this hilltop fort.', time: '5:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600', lat: 26.9372, lng: 75.8154 },
        ]
      },
      {
        title: 'Hawa Mahal & Bazaar Tour',
        subtitle: 'Wind palace & vibrant markets',
        places: [
          { name: 'Hawa Mahal (Palace of Winds)', description: 'Iconic 5-story honeycomb facade with 953 small windows built for royal women.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', lat: 26.9239, lng: 75.8267 },
          { name: 'Johari Bazaar & Bapu Bazaar', description: 'Shop for traditional jewelry, textiles, and Rajasthani handicrafts.', time: '12:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1524309349498-b5be4ba878c8?w=600', lat: 26.9200, lng: 75.8230 },
          { name: 'Chokhi Dhani Village Dinner', description: 'Authentic Rajasthani village experience with folk dance, puppet shows, and royal thali.', time: '6:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600', lat: 26.8100, lng: 75.7800 },
        ]
      },
      {
        title: 'Jantar Mantar & Jal Mahal',
        subtitle: 'Astronomical wonders & floating palace',
        places: [
          { name: 'Jantar Mantar Observatory', description: 'UNESCO site with the world\'s largest stone sundial and 19 astronomical instruments.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1524309349498-b5be4ba878c8?w=600', lat: 26.9247, lng: 75.8245 },
          { name: 'Jal Mahal (Water Palace)', description: 'Photograph the stunning palace floating in the middle of Man Sagar Lake.', time: '1:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600', lat: 26.9530, lng: 75.8461 },
          { name: 'Albert Hall Museum & Night Market', description: 'Beautiful Indo-Saracenic museum illuminated at night, surrounded by local food stalls.', time: '5:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600', lat: 26.9117, lng: 75.8195 },
        ]
      },
    ]
  },

  london: {
    center: [51.5074, -0.1278],
    currency: '£',
    hotels: [
      { name: 'The Savoy', area: 'Strand', rating: 4.9, pricePerNight: 480, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', style: 'luxury' },
      { name: 'The Z Hotel Soho', area: 'West End', rating: 4.3, pricePerNight: 130, image: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c11?w=600', style: 'mid-range' },
      { name: 'Generator London', area: 'Russell Square', rating: 4.0, pricePerNight: 40, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600', style: 'budget' },
    ],
    days: [
      {
        title: 'Big Ben & Westminster',
        subtitle: 'Royal palaces & historic parliament',
        places: [
          { name: 'Big Ben & Houses of Parliament', description: 'See London\'s most iconic clock tower and the Gothic-style Palace of Westminster.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600', lat: 51.5007, lng: -0.1246 },
          { name: 'Buckingham Palace & Changing of Guard', description: 'Witness the famous Changing of the Guard ceremony at the King\'s official residence.', time: '11:30 AM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600', lat: 51.5014, lng: -0.1419 },
          { name: 'London Eye at Sunset', description: 'Ride the giant observation wheel for 360° views of London bathed in golden light.', time: '6:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=600', lat: 51.5033, lng: -0.1196 },
        ]
      },
      {
        title: 'Tower Bridge & British Museum',
        subtitle: 'Medieval fortress & world-class antiquities',
        places: [
          { name: 'Tower of London', description: 'Explore 1000 years of history, see the Crown Jewels, and meet the famous ravens.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600', lat: 51.5081, lng: -0.0759 },
          { name: 'British Museum', description: 'Free entry to one of the world\'s greatest museums with the Rosetta Stone and Egyptian mummies.', time: '1:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=600', lat: 51.5194, lng: -0.1270 },
          { name: 'Covent Garden & West End Show', description: 'Street performers, shopping, and a world-class theatre show in London\'s entertainment heart.', time: '6:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600', lat: 51.5117, lng: -0.1240 },
        ]
      },
    ]
  },

  goa: {
    center: [15.2993, 74.1240],
    currency: '₹',
    hotels: [
      { name: 'Taj Exotica', area: 'Benaulim', rating: 4.8, pricePerNight: 250, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', style: 'luxury' },
      { name: 'Acron Waterfront Resort', area: 'Baga', rating: 4.4, pricePerNight: 80, image: 'https://images.unsplash.com/photo-1551882547-ff40c0d13c11?w=600', style: 'mid-range' },
      { name: 'Zostel Goa Anjuna', area: 'Anjuna', rating: 4.1, pricePerNight: 10, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600', style: 'budget' },
    ],
    days: [
      {
        title: 'North Goa Beaches & Forts',
        subtitle: 'Sun, sand & Portuguese heritage',
        places: [
          { name: 'Fort Aguada', description: 'Explore the well-preserved 17th-century Portuguese fort overlooking the Arabian Sea.', time: '8:30 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', lat: 15.4924, lng: 73.7734 },
          { name: 'Baga Beach & Water Sports', description: 'Jet skiing, parasailing, and banana boat rides at Goa\'s most popular beach.', time: '12:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', lat: 15.5563, lng: 73.7514 },
          { name: 'Tito\'s Lane Nightlife', description: 'Goa\'s legendary party street with clubs, live music, and beach shacks.', time: '8:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', lat: 15.5540, lng: 73.7530 },
        ]
      },
      {
        title: 'Old Goa Churches & Spice Farm',
        subtitle: 'UNESCO heritage & aromatic plantations',
        places: [
          { name: 'Basilica of Bom Jesus', description: 'UNESCO World Heritage church housing the remains of St. Francis Xavier.', time: '9:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', lat: 15.5009, lng: 73.9116 },
          { name: 'Sahakari Spice Farm', description: 'Walk through aromatic plantations of cardamom, vanilla, and black pepper with a traditional lunch.', time: '1:00 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', lat: 15.4200, lng: 74.0200 },
          { name: 'Anjuna Flea Market & Sunset', description: 'Browse hippie trinkets and handmade crafts while watching the sun melt into the sea.', time: '4:30 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', lat: 15.5735, lng: 73.7408 },
        ]
      },
      {
        title: 'South Goa Serenity',
        subtitle: 'Secluded beaches & peaceful coves',
        places: [
          { name: 'Palolem Beach', description: 'Crescent-shaped paradise beach with gentle waves perfect for swimming and kayaking.', time: '8:00 AM', period: 'morning', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', lat: 15.0100, lng: 74.0233 },
          { name: 'Butterfly Beach Secret Cove', description: 'Hidden cove accessible only by boat, surrounded by dolphins and colourful butterflies.', time: '12:30 PM', period: 'afternoon', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', lat: 15.0000, lng: 74.0100 },
          { name: 'Silent Noise Headphone Party', description: 'Unique silent disco on the beach where everyone dances to their own wireless channel.', time: '8:00 PM', period: 'evening', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', lat: 15.0090, lng: 74.0230 },
        ]
      },
    ]
  },
};

// Alias mapping for alternate names
const ALIASES: Record<string, string> = {
  tokyo: 'japan', france: 'paris', 'new york': 'london', nyc: 'london',
  uk: 'london', indonesia: 'bali', 'united arab emirates': 'dubai', uae: 'dubai',
  india: 'jaipur', rajasthan: 'jaipur', england: 'london',
};

/**
 * Returns smart destination data or generates sensible defaults
 */
export function getDestinationData(destination: string, numDays: number): DestinationInfo {
  const key = destination.toLowerCase().trim();
  
  // Direct match
  if (DESTINATIONS[key]) {
    const data = DESTINATIONS[key];
    return {
      ...data,
      days: extendDays(data.days, numDays),
    };
  }

  // Alias match
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (key.includes(alias)) {
      const data = DESTINATIONS[target];
      return { ...data, days: extendDays(data.days, numDays) };
    }
  }

  // Partial match
  for (const [destKey, data] of Object.entries(DESTINATIONS)) {
    if (key.includes(destKey) || destKey.includes(key)) {
      return { ...data, days: extendDays(data.days, numDays) };
    }
  }

  // Fallback: generate generic days
  return generateGenericDestination(destination, numDays);
}

function extendDays(days: DestinationDay[], numDays: number): DestinationDay[] {
  if (days.length >= numDays) return days.slice(0, numDays);
  
  // Cycle through existing days for extra days  
  const extended = [...days];
  while (extended.length < numDays) {
    const src = days[extended.length % days.length];
    extended.push({
      ...src,
      title: `${src.title} (Extended)`,
      subtitle: `More to explore — ${src.subtitle}`,
    });
  }
  return extended;
}

function generateGenericDestination(destination: string, numDays: number): DestinationInfo {
  const genericImages = [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
  ];

  const genericDayTemplates: DestinationDay[] = [
    {
      title: `${destination} City Centre Tour`,
      subtitle: 'Explore the heart of the city',
      places: [
        { name: `${destination} Main Square`, description: `Start your adventure at the bustling central square of ${destination}.`, time: '9:00 AM', period: 'morning', image: genericImages[0], lat: 0, lng: 0 },
        { name: 'Historic Old Town Walk', description: `Wander through centuries-old streets with stunning architecture and local shops.`, time: '1:00 PM', period: 'afternoon', image: genericImages[1], lat: 0, lng: 0 },
        { name: 'Rooftop Dinner & City Lights', description: 'End the day with panoramic views and local cuisine at a rooftop restaurant.', time: '7:00 PM', period: 'evening', image: genericImages[2], lat: 0, lng: 0 },
      ]
    },
    {
      title: 'Cultural & Heritage Day',
      subtitle: 'Museums, galleries & local traditions',
      places: [
        { name: `${destination} National Museum`, description: 'Discover the rich history and cultural artifacts of the region.', time: '9:30 AM', period: 'morning', image: genericImages[1], lat: 0, lng: 0 },
        { name: 'Art Gallery & Local Market', description: 'Browse local artwork and handmade crafts at the traditional market.', time: '1:30 PM', period: 'afternoon', image: genericImages[3], lat: 0, lng: 0 },
        { name: 'Traditional Dinner Experience', description: 'Savour authentic local cuisine with traditional music and performances.', time: '7:00 PM', period: 'evening', image: genericImages[4], lat: 0, lng: 0 },
      ]
    },
    {
      title: 'Nature & Adventure Day',
      subtitle: 'Scenic landscapes & outdoor thrills',
      places: [
        { name: 'Sunrise Viewpoint Hike', description: `Trek to a scenic viewpoint near ${destination} for stunning sunrise views.`, time: '6:30 AM', period: 'morning', image: genericImages[0], lat: 0, lng: 0 },
        { name: 'Lake / Beach Relaxation', description: 'Spend the afternoon at a beautiful lake or beach enjoying water activities.', time: '12:30 PM', period: 'afternoon', image: genericImages[3], lat: 0, lng: 0 },
        { name: 'Sunset Spot & Street Food', description: 'Watch a spectacular sunset and explore the local street food scene.', time: '5:30 PM', period: 'evening', image: genericImages[2], lat: 0, lng: 0 },
      ]
    },
  ];

  const days = extendDays(genericDayTemplates, numDays);

  return {
    center: [28.6139, 77.2090],
    currency: '$',
    hotels: [
      { name: `${destination} Grand Hotel`, area: 'City Center', rating: 4.7, pricePerNight: 200, image: genericImages[0], style: 'luxury' },
      { name: `${destination} Comfort Inn`, area: 'Old Town', rating: 4.3, pricePerNight: 80, image: genericImages[1], style: 'mid-range' },
      { name: `${destination} Backpacker Hostel`, area: 'Downtown', rating: 4.0, pricePerNight: 25, image: genericImages[2], style: 'budget' },
    ],
    days,
  };
}
