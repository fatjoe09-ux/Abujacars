const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;
const logo = (s) => `https://cdn.simpleicons.org/${s}`;
const pw = 'Password1';

export const seedUsers = [
  { id: 'v1', role: 'vendor', name: 'Adaeze Obi', email: 'vendor@demo.com', password: pw, phone: '+234 801 234 5678', companyName: 'Prime Motors Lagos', location: 'Lagos, Nigeria', about: 'Premium new and certified pre-owned cars with full after-sales support.', logo: '' },
  { id: 'v2', role: 'vendor', name: 'Musa Bello', email: 'sahara@demo.com', password: pw, phone: '+234 803 111 2222', companyName: 'Sahara Auto Hub', location: 'Abuja, Nigeria', about: 'Trusted SUVs and family cars at honest prices.', logo: '' },
  { id: 'v3', role: 'vendor', name: 'Ngozi Eze', email: 'delta@demo.com', password: pw, phone: '+234 805 333 4444', companyName: 'Delta Wheels', location: 'Port Harcourt, Nigeria', about: 'Performance and electric cars for modern drivers.', logo: '' },
  { id: 'u1', role: 'user', name: 'William Pet', email: 'user@demo.com', password: pw, phone: '+234 802 000 0000' },
];

const base = { available: true, transmission: 'Automatic', fuel: 'Petrol', seats: 4 };
export const seedCars = [
  { ...base, id: 'c1', vendorId: 'v1', name: 'Porsche 911 Carrera', brand: 'Porsche', logo: logo('porsche'), image: img('photo-1503376780353-7e6692767b70'), description: 'Iconic rear-engine sports coupe with breathtaking handling.', category: 'Sport', year: 2024, status: 'New', price: 135000, rentPrice: 650 },
  { ...base, id: 'c2', vendorId: 'v1', name: 'BMW M4 Competition', brand: 'BMW', logo: logo('bmw'), image: img('photo-1555215695-3004980ad54e'), description: 'Twin-turbo power with track-ready precision and luxury.', category: 'Coupe', year: 2023, status: 'New', price: 92000, rentPrice: 420 },
  { ...base, id: 'c3', vendorId: 'v3', name: 'Ford Mustang GT', brand: 'Ford', logo: logo('ford'), image: img('photo-1494976388531-d1058494cdd8'), description: 'Classic American V8 muscle with modern comfort.', category: 'Coupe', year: 2020, status: 'Used', price: 38000, rentPrice: 210 },
  { ...base, id: 'c4', vendorId: 'v1', name: 'Mercedes-Benz C-Class', brand: 'Mercedes', logo: logo('mercedes'), image: img('photo-1618843479313-40f8afb4b4d8'), description: 'Elegant executive sedan with a refined, tech-rich cabin.', category: 'Sedan', year: 2024, status: 'New', price: 58000, rentPrice: 300, seats: 5 },
  { ...base, id: 'c5', vendorId: 'v2', name: 'Toyota Camry XLE', brand: 'Toyota', logo: logo('toyota'), image: img('photo-1621007947382-bb3c3994e3fb'), description: 'Reliable, fuel-efficient family sedan that never lets you down.', category: 'Sedan', year: 2019, status: 'Used', price: 21000, rentPrice: 90, seats: 5 },
  { ...base, id: 'c6', vendorId: 'v2', name: 'Land Rover Defender', brand: 'Land Rover', logo: logo('landrover'), image: img('photo-1606016159991-dfe4f2746ad5'), description: 'Go-anywhere SUV with rugged capability and presence.', category: 'SUV', year: 2021, status: 'Used', price: 64000, rentPrice: 330, fuel: 'Diesel', seats: 7 },
  { ...base, id: 'c7', vendorId: 'v3', name: 'Tesla Model 3', brand: 'Tesla', logo: logo('tesla'), image: img('photo-1560958089-b8a1929cea89'), description: 'Fully electric, quick and quiet with long range.', category: 'Electric', year: 2023, status: 'New', price: 45000, rentPrice: 240, fuel: 'Electric', seats: 5 },
  { ...base, id: 'c8', vendorId: 'v2', name: 'Honda CR-V', brand: 'Honda', logo: logo('honda'), image: img('photo-1519641471654-76ce0107ad1b'), description: 'Spacious compact SUV, great for family road trips.', category: 'SUV', year: 2018, status: 'Used', price: 19500, rentPrice: 85, seats: 5, available: false },
];
