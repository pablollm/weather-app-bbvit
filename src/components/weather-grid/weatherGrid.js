
import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import favoriteCard from "../favoriteCard/favoriteCard";

const WeatherGrid = ({data, removeCity}) => {


  return (
/*
    <div>
      <ul>
      {data && data.map((item,index) => 
        
        <section key={index}>
        <p>{item.name}</p>
        <p>{Math.round(item.main.temp)}°C</p>
        </section>
        
      
      )}
      </ul>
    
    
    </div>
*/
    <>
      <label className="title">Favorites</label>
      <Accordion allowZeroExpanded>
        {data.map((item, idx) => (
          <AccordionItem key={idx}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <div className="daily-item">
                  <label>{item.name}</label>
                  <img src={`icons/${item.weather[0].icon}.png`} className="icon-small" alt="weather" />
                  <label className="description">{item.weather[0].description}</label>
                  <label className="min-max">{Math.round(item.main.temp_max)}°C /{Math.round(item.main.temp_min)}°C</label>
                  <button onClick={() => removeCity(item.id)}>Delete</button>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="daily-details-grid">
                <div className="daily-details-grid-item">
                  <label>Pressure:</label>
                  <label>{item.main.pressure}</label>
                </div>
                <div className="daily-details-grid-item">
                  <label>Humidity:</label>
                  <label>{item.main.humidity}</label>
                </div>
                <div className="daily-details-grid-item">
                  <label>Clouds:</label>
                  <label>{item.clouds.all}%</label>
                </div>
                <div className="daily-details-grid-item">
                  <label>Wind speed:</label>
                  <label>{item.wind.speed} m/s</label>
                </div>
                <div className="daily-details-grid-item">
                  <label>Sea level:</label>
                  <label>{item.main.sea_level}m</label>
                </div>
                <div className="daily-details-grid-item">
                  <label>Feels like:</label>
                  <label>{item.main.feels_like}°C</label>
                </div>

              </div>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>

  );

}
export default WeatherGrid;