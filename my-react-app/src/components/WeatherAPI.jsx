import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import search_icon from '../assets/search.png';
import cloud_icon from '../assets/cloud.png';
import humidity_icon from '../assets/humidity.png';
import clear_icon from '../assets/clear.png';
import drizzle_icon from '../assets/drizzle.png';
import snow_icon from '../assets/snow.png';
import rain_icon from '../assets/rain.png';
import wind_icon from '../assets/wind.png';
import '../components/Weather.css';

const Weather = () => {

    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(false);
    const [error, setError] = useState("");
    const [unit, setUnit] = useState("metric"); // "metric" or "imperial"
    const celsiusToFahrenheit = (c) => (c * 9/5) + 32;
    const kmhToMph = (k) => k / 1.60934;


    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };
    
    const fetchWeather = async (name) => {

        
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&appid=${apiKey}`;

        if (!name) return;
        setError("");

        try {
            
            const response = await axios.get(url);
            
            const data = response.data;
            
            console.log(response.data);

            const icon = allIcons[data.weather[0].icon] || clear_icon;

            setWeatherData({
                humidity: data.main.humidity,
                windSpeedMS: data.wind.speed, 
                temperatureC: data.main.temp, 
                location: data.name,
                icon: icon

            });


        } catch (err) {

            setError("City not found. Try again." + name);

        }

    };
    

    return (
        <div className = "weather">
            <div className = "search-bar">
                <input 
                ref={inputRef}
                type="text" 
                placeholder="Search"
                />
                <img 
                src={search_icon} 
                alt="" 
                onClick = {()=>fetchWeather(inputRef.current.value)}
                />

                {error && <p className = "text-danger mt-2">{error}</p>}

            </div>
            <img src={weatherData.icon} alt="" className="weather-icon"/>
            <p className="temperature">
                {unit === "metric"
                    ? `${Math.round(weatherData.temperatureC)}°C`
                    : `${Math.round(celsiusToFahrenheit(weatherData.temperatureC))}°F`}
            </p>

            <p className="location">{weatherData.location}</p>

            <div className="weather-data">
                <div className="col">
                    <img src={humidity_icon} alt=""/>
                    <div>
                        <p>{weatherData.humidity}%</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div className="col">
                    <img src={wind_icon} alt="" />
                    <div>
                        <p>
                            {unit === "metric"
                                ? `${Math.round(weatherData.windSpeedMS * 3.6)} km/h`
                                : `${Math.round(kmhToMph(weatherData.windSpeedMS * 3.6))} mph`}
                        </p>

                        <span>Wind Speed</span>
                    </div>
                </div>
            </div>
            
            <button onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}>
                Switch to {unit === "metric" ? "°F / mph" : "°C / km/h"}
            </button>

        </div>
    );
};

export default Weather;