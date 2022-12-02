import { useEffect, useState } from "react";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import WeatherGrid from "./components/weather-grid/weatherGrid";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";
import CardWeather from "./components/card-weather/card-weather";


function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [latitude, setLat] = useState(null);
  const [longitude, setLong] = useState(null);
  const [datax, setDatax] = useState(null);


      navigator.geolocation.getCurrentPosition(function(position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
        var aux = {
          value: position.coords.latitude + '' + position.coords.longitude
        }
        console .log(aux);
      });
  

  
    useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(function(position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
         var aux = {
          value: position.coords.latitude + ' ' + position.coords.longitude
        }
        handleOnSearchChange(aux);
        
      });


    }
    fetchData();
  }, [latitude,longitude])
  


  const handleOnSearchChange = (searchData) => {
    console.log("searchData",searchData);
    const [lat, lon] = searchData.value.split(" ")
    console.log(lat,lon);
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

        Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forcastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forcastResponse });
      })
      .catch((err) =>console.log(err));
  };
  console.log(currentWeather);
  console.log(forecast);
  console.log(datax);

const [weather, setWeather] = useState(null);
const [savedCityIds, setSavedCityIds] = useState([]);
const [citiesData, setCitiesData] = useState([]);
const [message, setMessage] = useState(null);
const [fetchingCities, setFetchingCities] = useState(true);

// Fetches cities that were saved to local storage previously
  const fetchSavedCities  = async () =>{
    const cityStorage = localStorage.getItem("cityStorage"); // Get saved city ids from local storage
    const queryArr = cityStorage ? JSON.parse(cityStorage) : []; // Parse string to get array
    let dataux;
    if (queryArr.length) {
      const list = queryArr.join(",")

      console.log("list: " + list);
      console.log("queryArr:"+ queryArr);

     const resp = await fetch(`${WEATHER_API_URL}/group?id=${list}&appid=${WEATHER_API_KEY}&units=metric`)
      /*const { data } = await axios.get(
        `/api/forward/list?list=${queryArr.join(",")}`
      );*/
       .then((res) => res.json())
        .then((data) =>{
       
         data = data.list
          setCitiesData([...data]);

        })
      //const {data} = await resp.json();
      setSavedCityIds([...queryArr]); // Set state to track city ids
     // const dataArray = Object.entries(data)
      //console.log("data",{data});
     //setCitiesData([...data]); // Set all cities for WeatherGrid
      
      setFetchingCities(false);
    } else {
      setFetchingCities(false);
    }
  };

  // Save city to local storage, updates displayed weather locations
  const onSaveCity = id => {
    console.log('onSaveCityentro', id);
    let cityArr;
    const cityStorage = localStorage.getItem("cityStorage");
    // If no saved cities, save new city and return
    if (!cityStorage) {
      cityArr = [id];
      localStorage.setItem("cityStorage", JSON.stringify(cityArr));
      return fetchSavedCities();
    }
    const cityStorageArr = JSON.parse(cityStorage); // Parse string containing city ids to array
    // OWM limit of 20 locations in a request
    if (cityStorageArr.length >= 20) {
     /* setMessage({
        type: "error",
        message:
          "Can only save a maximum of 20 cities. Please remove from your currently saved cities to add new ones."
      });*/
      return setInterval(() => setMessage(null), 5000);
    }
    // If city not already stored, adds it
    if (!cityStorageArr.includes(id)) {
      cityArr = cityStorageArr.push(id); // Add to array
      localStorage.setItem("cityStorage", JSON.stringify(cityStorageArr)); // Stringify and save to local storage
      // State updates
      console.log(cityStorage);
      //setCitiesData([...citiesData, weather]);
      //setCurrentWeather(null);

   //   setMessage({ type: "success", message: "City added successfully." });
      return fetchSavedCities();;
    }
  };
  // Removes city from local storage and from currently displayed cities
  const removeCity = id => {
    const filteredStorage = JSON.parse(
      localStorage.getItem("cityStorage")
    ).filter(cityId => cityId !== id); // Parsed saved cities string to array and filter out removed city

    localStorage.setItem("cityStorage", JSON.stringify(filteredStorage)); // Stringify filtered array and save

    const updatedCities = citiesData.filter(city => city.id !== id); // Filter from state
    setCitiesData(updatedCities); // Update state

    setMessage({ type: "success", message: "Successfully removed city." });
    return setInterval(() => setMessage(null), 5000);
  };
  console.log("savedcitiesid",savedCityIds);
  console.log("citiesData",citiesData);


  return (
    <main className='container'>
      <Search onSearchChange={handleOnSearchChange}/>

      {currentWeather &&
      <section>
       <CurrentWeather weather={currentWeather} />
       <button onClick={() => onSaveCity(currentWeather.id)}>Save</button>
      </section>
      }
      {forecast && <Forecast data={forecast} />}
      {citiesData && <WeatherGrid data={citiesData} removeCity={removeCity}/> }

    </main>
    
  );
}

export default App;
