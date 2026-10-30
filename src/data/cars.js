const logo = (slug, hex) => `https://cdn.simpleicons.org/${slug}/${hex}`;

export const brands = [

  { name: "Toyota", logo: logo("toyota", "EB0A1E") },

  { name: "BMW", logo: logo("bmw", "1C69D4") },

  { name: "Mercedes", logo: "/Logo/Benzs.png" },

  { name: "Ford", logo: logo("ford", "003478") },

  { name: "Porsche", logo: logo("porsche", "B12B28") },

  { name: "Honda", logo: logo("honda", "CC0000") },

];

// Optional: add a `gallery: [url1, url2, ...]` array to any car to show thumbnails on its details page.

export const cars = [

  { id: 1, name: "Toyota Camry XSE", brand: "Toyota", logo: brands[0].logo,

    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",

    description: "Smooth hybrid sedan, ideal for city and long trips.",

    price: 62, unit: "/day", mode: "rent", availability: "Available", status: "New",

    year: 2024, transmission: "Automatic", fuel: "Hybrid", seats: 5, mileage: "1,200 km", color: "Pearl white", location: "Lagos" },

  { id: 2, name: "BMW M4 Coupe", brand: "BMW", logo: brands[1].logo,

    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",

    description: "Twin-turbo performance with a sharp, planted feel.",

    price: 74500, unit: "", mode: "sale", availability: "Available", status: "Used",

    year: 2021, transmission: "Automatic", fuel: "Petrol", seats: 4, mileage: "28,000 km", color: "Black", location: "Abuja" },

  { id: 3, name: "Porsche 911 Carrera", brand: "Porsche", logo: brands[4].logo,

    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",

    description: "Iconic rear-engine sports car, weekend-ready.",

    price: 240, unit: "/day", mode: "rent", availability: "Rented", status: "New",

    year: 2024, transmission: "Automatic", fuel: "Petrol", seats: 4, mileage: "900 km", color: "Silver", location: "Lagos" },

  { id: 4, name: "Ford Mustang GT", brand: "Ford", logo: brands[3].logo,

    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",

    description: "V8 muscle with a loud, confident character.",

    price: 48900, unit: "", mode: "sale", availability: "Available", status: "Used",

    year: 2020, transmission: "Manual", fuel: "Petrol", seats: 4, mileage: "41,500 km", color: "Race red", location: "Ibadan" },

  { id: 5, name: "Mercedes C-Class", brand: "Mercedes", logo: brands[2].logo,

    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",

    description: "Refined cabin and a quiet, comfortable ride.",

    price: 95, unit: "/day", mode: "rent", availability: "Available", status: "New",

    year: 2023, transmission: "Automatic", fuel: "Petrol", seats: 5, mileage: "5,300 km", color: "Graphite grey", location: "Abuja" },

  { id: 6, name: "Honda Accord Sport", brand: "Honda", logo: brands[5].logo,

    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800",

    description: "Reliable and efficient, with room for the whole family.",

    price: 27800, unit: "", mode: "sale", availability: "Sold", status: "Used",

    year: 2019, transmission: "Automatic", fuel: "Petrol", seats: 5, mileage: "62,000 km", color: "Blue", location: "Lagos" },

];
 