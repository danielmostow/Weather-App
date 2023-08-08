import React, { useState } from 'react'
import './WeatherForecast.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import WeatherCard from './weather-card'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface WeatherData {
  date: { day: string; night: string };
  temperature: { day: string; night: string };
  shortForecast:{ day: string; night: string };
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
          date: { day: dayForecast.name, night: nightForecast.name},
          temperature: { day: `${dayForecast.temperature} °F`, night: `${nightForecast.temperature} °F` },
          shortForecast: {day: dayForecast.shortForecast, night: nightForecast.shortForecast}
        };
        formattedWeatherData.push(formattedDayForecast)
    }

    setWeatherData(formattedWeatherData)
    setLoading(false)
    toast.success('Click the card to swap between night and day', {
      position: toast.POSITION.BOTTOM_CENTER
  })
    } catch (error) {
      console.error('Error fetching weather data:', error)
      setLoading(false)
      toast.error('Something went wrong, please check your input and try again', {
        position: toast.POSITION.BOTTOM_CENTER
    })
    }
  }

  const reset = () =>{
    setAddressLine1('')
    setCity('')
    setLoading(false)
    setState('')
    setWeatherData([])
    setZipCode('')
  }

  return (
<div className='container'>
    <h1>7-Day Weather Forecast</h1>
    <div className='input-container'>
      <TextField
        label='Address Line 1'
        variant='outlined'
        value={addressLine1}
        onChange={handleAddressLine1Change}
        fullWidth
      />
    </div>
    <div className='input-container'>
      <TextField
        label='City'
        variant='outlined'
        value={city}
        onChange={handleCityChange}
        fullWidth
      />
    </div>
    <div className='input-container'>
      <TextField
        label='State'
        variant='outlined'
        value={state}
        onChange={handleStateChange}
        fullWidth
      />
    </div>
    <div className='input-container'>
      <TextField
        label='Zip Code'
        variant='outlined'
        value={zipCode}
        onChange={handleZipCodeChange}
        fullWidth
      />
    </div>
    <Button variant='contained' color='primary' onClick={fetchWeatherData}>
      Get Forecast
    </Button>
    <Button variant='contained' color='secondary' onClick={reset} sx={{marginTop: '10px'}}>
      Reset
    </Button>
      {loading && <div className='loading-feedback'>Loading...</div>}
      
      <div className='weather-cards-container'>
        {weatherData.map((data) => (
          <WeatherCard
            key={data.date.day}
            dayDate={data.date.day}
            nightDate={data.date.night}
            dayTemperature={data.temperature.day}
            nightTemperature={data.temperature.night}
            dayForecast={data.shortForecast.day}
            nightForecast={data.shortForecast.night}
          />
  ))}
</div>
      <ToastContainer />
    </div>
  )
}

export default WeatherForecast

