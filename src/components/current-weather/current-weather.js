
import "./current-weather.css";
import { WEATHER_API_KEY,WEATHER_API_URL } from "../../api";
import React, { useState } from "react";

const CurrentWeather = ({weather}) => {


  return (
    <section className="current-weather-container">
      <div className="current-weather-header">
        <div>
          <p className="weather-city">{weather.name}</p>
          <p className="weather-description">{weather.weather[0].description}</p>
        </div>
        <img
          alt="weather"
          className="weather-icon"
          src={`icons/${weather.weather[0].icon}.png`}
        />
      </div>
      <div className="current-weather-footer">
        <p className="temperature">{Math.round(weather.main.temp)}°C</p>
        <div className="details">
          <div className="parameter-row">
            <span className="parameter-label">Details</span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Feels like</span>
            <span className="parameter-value">
              {Math.round(weather.main.feels_like)}°C
            </span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Wind</span>
            <span className="parameter-value">{weather.wind.speed} m/s</span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Humidity</span>
            <span className="parameter-value">{weather.main.humidity}%</span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Pressure</span>
            <span className="parameter-value">{weather.main.pressure} hPa</span>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default CurrentWeather;