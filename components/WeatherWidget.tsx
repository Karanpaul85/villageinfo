"use client";
import { useState, useEffect } from "react";

const WMO_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Heavy showers",
  95: "Thunderstorm",
};

const WMO_EMOJI: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "❄️",
  75: "❄️",
  80: "🌦️",
  81: "⛈️",
  95: "⛈️",
};

function getWeatherLabel(code: number) {
  return WMO_CODES[code] ?? "Unknown";
}

function getWeatherEmoji(code: number) {
  return WMO_EMOJI[code] ?? "🌡️";
}

function formatDay(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
  };
}

type WeatherData = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    time: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

// ... keep all WMO_CODES, WMO_EMOJI, getWeatherLabel, getWeatherEmoji, formatDay, WeatherData same ...

function WeatherSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 w-full animate-pulse">
      {/* Current */}
      <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
      <div className="h-12 w-32 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-28 bg-gray-200 rounded mb-4" />

      <div className="flex gap-6 border-t border-gray-100 pt-3 mb-1">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
      <div className="h-3 w-40 bg-gray-100 rounded mb-5" />

      {/* Today highlight */}
      <div className="bg-gray-50 rounded-lg px-4 py-3 mb-5 flex gap-4">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="h-4 w-28 bg-gray-200 rounded" />
      </div>

      {/* 7-day */}
      <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-2">
            <div className="h-3 w-8 bg-gray-200 rounded" />
            <div className="h-3 w-8 bg-gray-100 rounded" />
            <div className="h-6 w-6 bg-gray-200 rounded-full" />
            <div className="h-3 w-10 bg-gray-200 rounded" />
            <div className="h-3 w-8 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
// function WeatherSkeleton() {
//   return (
//     <div
//       className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 w-full flex items-center justify-center"
//       style={{ minHeight: "inherit", height: "100%" }}
//     >
//       <div className="relative w-32 h-24">
//         {/* Sun */}
//         <div className="absolute top-0 left-0 animate-spin [animation-duration:8s]">
//           <div className="w-12 h-12 rounded-full bg-yellow-300 shadow-[0_0_24px_8px_rgba(253,224,71,0.5)]" />
//         </div>

//         {/* Cloud 1 (main) */}
//         <div className="absolute bottom-0 right-0 animate-[bounce_3s_ease-in-out_infinite]">
//           <div className="relative">
//             <div className="w-16 h-7 bg-gray-200 rounded-full" />
//             <div className="absolute -top-4 left-2 w-9 h-9 bg-gray-200 rounded-full" />
//             <div className="absolute -top-3 left-8 w-7 h-7 bg-gray-200 rounded-full" />
//           </div>
//         </div>

//         {/* Cloud 2 (small, behind) */}
//         <div className="absolute bottom-2 left-6 animate-[bounce_4s_ease-in-out_infinite_0.8s] opacity-50">
//           <div className="relative">
//             <div className="w-10 h-5 bg-gray-100 rounded-full" />
//             <div className="absolute -top-3 left-2 w-6 h-6 bg-gray-100 rounded-full" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function WeatherWidget({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude) return;

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata`,
        );
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        setData(json);
      } catch {
        setError(true);
      }
    }

    fetchWeather();
  }, [latitude, longitude]);

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-sm text-gray-400">
        Weather data unavailable.
      </div>
    );
  }

  if (!data) return <WeatherSkeleton />;

  const { current, daily } = data;

  const updatedAt = new Date(current.time).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 w-full">
      <p className="text-sm text-gray-500 mb-1">
        {getWeatherLabel(current.weather_code)}
      </p>
      <div className="text-5xl font-bold text-gray-900 mb-1">
        {Math.round(current.temperature_2m)}°C
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Feels like {Math.round(current.apparent_temperature)}°C
      </p>
      <div className="flex gap-6 text-sm text-gray-700 border-t border-gray-100 pt-3 mb-1">
        <span>
          <span className="font-medium">Humidity:</span>{" "}
          {current.relative_humidity_2m}%
        </span>
        <span>
          <span className="font-medium">Wind:</span>{" "}
          {Math.round(current.wind_speed_10m)} km/h
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-5">Updated: {updatedAt}</p>

      <div className="bg-gray-50 rounded-lg px-4 py-3 mb-5 text-sm text-gray-700 flex gap-4">
        <span>
          <span className="font-medium">Today:</span>{" "}
          {Math.round(daily.temperature_2m_max[0])}° /{" "}
          {Math.round(daily.temperature_2m_min[0])}°
        </span>
        <span>Rain Chance: {daily.precipitation_probability_max[0]}%</span>
      </div>

      {/* 7-Day Forecast */}
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        7-Day Forecast
      </h3>
      <div className="overflow-x-auto -mx-5 px-5">
        <div className="flex gap-1 text-center text-xs text-gray-600">
          {daily.time.map((dateStr, i) => {
            const { day, date } = formatDay(dateStr);
            return (
              <div
                key={dateStr}
                className={`flex flex-col items-center gap-1 rounded-lg p-2 min-w-25 ${
                  i === 0 ? "bg-blue-50 text-blue-700" : ""
                }`}
              >
                <span className="font-semibold">{day}</span>
                <span className="text-gray-400">{date}</span>
                <span className="text-lg">
                  {getWeatherEmoji(daily.weather_code[i])}
                </span>
                <span className="font-medium">
                  {Math.round(daily.temperature_2m_max[i])}° /{" "}
                  {Math.round(daily.temperature_2m_min[i])}°
                </span>
                <span className="text-gray-400">
                  Rain: {daily.precipitation_probability_max[i]}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
