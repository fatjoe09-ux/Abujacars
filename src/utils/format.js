export const money = (n) => '$' + Number(n || 0).toLocaleString();
export const CATEGORIES = ['Sedan', 'SUV', 'Sport', 'Coupe', 'Electric', 'Truck'];
export const todayStr = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
export const FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#13294f"/><stop offset="1" stop-color="#0b1a33"/></linearGradient></defs><rect width="900" height="600" fill="url(#g)"/><text x="450" y="320" font-size="90" text-anchor="middle" fill="#e11d2e">🚗</text></svg>');
