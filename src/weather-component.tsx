import React, { useState } from 'react'
import './WeatherForecast.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
interface WeatherData {
  date: string
  temperature: string
  description: string
}

  const WeatherForecast: React.FC = () => {
    const [addressLine1, setAddressLine1] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [weatherData, setWeatherData] = useState<WeatherData[]>([])
    const [loading, setLoading] = useState(false) // Add a loading state


  const handleAddressLine1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressLine1(event.target.value)
  }

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value)
  }

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value)
  }

  const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(event.target.value)
  }
  const fetchWeatherData = async () => {
    try {
      setLoading(true)
      // Fetch latitude and longitude from the US Census Geocoding service
      const fullAddress = `${addressLine1}, ${city}, ${state} ${zipCode}` 
      const geocodingApiUrl = `https://localhost:44339/WeatherApp/coordinates?address=${(fullAddress)}`
      const geocodingResponse = await fetch(geocodingApiUrl)
      const geocodingData = await geocodingResponse.json()
      const { x, y } = geocodingData.result.addressMatches[0].coordinates

      //fetch weather info from gov api
      const weatherApiUrl = `https://localhost:44339/WeatherApp/weather?x=${x}&y=${y}`
      const weatherResponse = await fetch(weatherApiUrl)
      const weatherProperties = await weatherResponse.json()

      //fetch 7 day forecast from url generated from gov api
      const weatherForecast = weatherProperties.properties.forecast
      const weatherForecastResponse = await fetch(weatherForecast)
      const weatherForecastData = await weatherForecastResponse.json()
      const dailyForecast = weatherForecastData.properties.periods.slice(0, 14)

      // Format weather data
      const formattedWeatherData = []
      for (let i = 0; i < dailyForecast.length; i += 2) {
        const dayForecast = dailyForecast[i]
        const nightForecast = dailyForecast[i + 1]

        const formattedDayForecast = {
          date: dayForecast.name,
          temperature: `${dayForecast.temperature} °F`,
          description: dayForecast.detailedForecast,
          time: 'Day',
        }

        const formattedNightForecast = {
          date: nightForecast.name,
          temperature: `${nightForecast.temperature} °F`,
          description: nightForecast.detailedForecast,
          time: 'Night',
        }

        formattedWeatherData.push(formattedDayForecast, formattedNightForecast)
    }

    setWeatherData(formattedWeatherData)
    setLoading(false)
    } catch (error) {
      console.error('Error fetching weather data:', error)
      setLoading(false)
      toast.error('Something went wrong, please check your input and try again', {
        position: toast.POSITION.BOTTOM_CENTER
    })
    }
  }

  return (
    <div className='container'>
      <h1>7-Day Weather Forecast</h1>
      <div className='input-container'>
        <label>Address Line 1:</label>
        <input type='text' value={addressLine1} onChange={handleAddressLine1Change} placeholder='Address Line 1' />
      </div>
      <div className='input-container'>
        <label>City:</label>
        <input type='text' value={city} onChange={handleCityChange} placeholder='City' />
      </div>
      <div className='input-container'>
        <label>State:</label>
        <input type='text' value={state} onChange={handleStateChange} placeholder='State' />
      </div>
      <div className='input-container'>
        <label>Zip Code:</label>
        <input type='text' value={zipCode} onChange={handleZipCodeChange} placeholder='Zip Code' />
      </div>
      <button onClick={fetchWeatherData}>Get Forecast</button>
      {loading && <div className='loading-feedback'>Loading...</div>}
      <ul>
        {weatherData.map((data) => (
          <li key={data.date}>
            <strong>{data.date}</strong> - {data.temperature} - {data.description}
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  )
}

export default WeatherForecast

