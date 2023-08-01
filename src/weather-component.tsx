import React, { useState } from 'react';

interface WeatherData {
  date: string;
  temperature: string;
  description: string;
}

  const WeatherForecast: React.FC = () => {
  const [address, setAddress] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const fetchWeatherData = async () => {
    try {
      // Fetch latitude and longitude from the US Census Geocoding service
      //const geocodingApiUrl = `https://localhost:44339/WeatherApp?encodedAddress=${encodeURIComponent(address)}`;
      const geocodingApiUrl = `https://localhost:44339/WeatherApp/coordinates?address=${(address)}`;
      const geocodingResponse = await fetch(geocodingApiUrl)
      const geocodingData = await geocodingResponse.json();
      const { x, y } = geocodingData.result.addressMatches[0].coordinates;
      // Fetch 7-day forecast from the US National Weather Service API
      const weatherApiUrl = `https://localhost:44339/WeatherApp/weather?x=${x}&y=${y}`;
      const weatherResponse = await fetch(weatherApiUrl);
      const weatherDatam = await weatherResponse.json();
      const weatherForecast = weatherDatam.properties.forecast;
      const hi = await fetch(weatherForecast)
      const bye = await hi.json();
      const dailyForecast = bye.properties.periods.slice(0, 14);

      // Format weather data
    const formattedWeatherData = [];
    for (let i = 0; i < dailyForecast.length; i += 2) {
      const dayForecast = dailyForecast[i];
      const nightForecast = dailyForecast[i + 1];

      const formattedDayForecast = {
        date: dayForecast.name,
        temperature: `${dayForecast.temperature} °F`,
        description: dayForecast.detailedForecast,
        time: 'Day',
      };

      const formattedNightForecast = {
        date: nightForecast.name,
        temperature: `${nightForecast.temperature} °F`,
        description: nightForecast.detailedForecast,
        time: 'Night',
      };

      formattedWeatherData.push(formattedDayForecast, formattedNightForecast);
    }

    setWeatherData(formattedWeatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div>
      <h1>7-Day Weather Forecast</h1>
      <input type="text" value={address} onChange={handleAddressChange} placeholder="Enter Address" />
      <button onClick={fetchWeatherData}>Get Forecast</button>
      <ul>
        {weatherData.map((data) => (
          <li key={data.date}>
            <strong>{data.date}</strong> - {data.temperature} - {data.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherForecast;
