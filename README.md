# SkyCast 🌤️

> **Weather Anywhere, Instantly.**

A modern, production-ready weather dashboard built with React, TypeScript, Vite, Tailwind CSS, and the OpenWeatherMap API.

---

## ✨ Features

- **Current Weather** — Temperature, condition, feels-like, humidity, wind, pressure, visibility, cloud cover
- **Hourly Forecast** — Next 24-hour breakdown with precipitation probability
- **5-Day Forecast** — Daily min/max temperature range bars with weather icons
- **Air Quality** — AQI index with full pollutant breakdown (PM2.5, PM10, O₃, NO₂, SO₂, CO)
- **Sun Info** — Sunrise, sunset, day length with visual progress arc
- **Weather Charts** — Temperature, humidity, wind speed, and precipitation trends (Recharts)
- **Geolocation** — "Use My Location" button with reverse geocoding
- **City Search** — Autocomplete via OpenWeather Geocoding API + debounced input
- **Recent Searches** — LocalStorage persisted, clearable
- **Favorites** — Save cities with one click, quick-access from any page
- **Dark Mode** — Fully themed glassmorphism UI, persisted across sessions
- **Unit Settings** — °C/°F temperature, km/h/mph wind speed

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack Query (React Query) |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP | Axios |
| Dates | date-fns |
| Deployment | Vercel |

---

---

## 🚀 Quick Start

### 1. Get an API Key

Sign up free at [openweathermap.org](https://openweathermap.org/api) → API Keys tab.

### 2. Install & Run

```bash
git clone https://github.com/your-username/skycast.git
cd skycast
npm install

# Create environment file
cp .env.example .env
# Edit .env: add your VITE_OPENWEATHER_API_KEY

npm run dev
```

Open [http://localhost:5173](http://localhost:5173)


---

## 🌐 Environment Variables

```env
# .env
VITE_OPENWEATHER_API_KEY=your_key_here
```



## 📄 License

MIT


Build with ❤️ by v44heat
