import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader } from '@mui/material';
import CardFlip from 'react-card-flip';


interface WeatherCardProps {
    dayDate: string;
    nightDate:string
    dayTemperature: string;
    nightTemperature: string;
    dayForecast: string;
    nightForecast: string
  }

const WeatherCard : React.FC<WeatherCardProps> =  ({ dayDate, nightDate, dayTemperature, nightTemperature, dayForecast, nightForecast }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <CardFlip isFlipped={isFlipped} flipDirection='horizontal'>
      <Card className='weather-card front' onClick={handleCardClick}>
      <CardHeader
                    title={dayDate}
                    titleTypographyProps={{variant:'h6' }}                 
                />
        <CardContent>
        <Typography variant='body2'>{dayForecast}</Typography>
        <Typography variant='body1' >Temperature: {dayTemperature}</Typography>
        </CardContent>
      </Card>
      <Card className='weather-card back' onClick={handleCardClick}>
      <CardHeader
                    title={nightDate}
                    titleTypographyProps={{variant:'h6' }}
                />
        <CardContent>
        <Typography variant='body2'>{nightForecast}</Typography>
        <Typography variant='body1'>Temperature: {nightTemperature}</Typography>
        </CardContent>
      </Card>
    </CardFlip>
  );
};

export default WeatherCard;
