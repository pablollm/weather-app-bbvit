
import "./card-weather.css";
import { WEATHER_API_KEY,WEATHER_API_URL } from "../../api";
import React, { useState } from "react";

const CardWeather = ({weatherData}) => {


  return (
    <>

   <section >
       {weatherData.name}
     
    </section>

    </>
 
  );
};

export default CardWeather;