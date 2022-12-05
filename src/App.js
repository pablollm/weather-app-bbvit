import { useEffect, useState } from "react";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import WeatherGrid from "./components/weather-grid/weatherGrid";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";



function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [latitude, setLat] = useState(null);
  const [longitude, setLong] = useState(null);
  const [savedCityIds, setSavedCityIds] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [fetchingCities, setFetchingCities] = useState(true);
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);

    useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      // Prevent the mini-infobar from appearing on mobile.
      event.preventDefault();
      console.log("👍", "beforeinstallprompt", event);
      // Stash the event so it can be triggered later.
      window.deferredPrompt = event;
      // Remove the 'hidden' class from the install button container.
      setIsReadyForInstall(true);
    });
    const fetchData = async () => {
      var aux;
      navigator.geolocation.getCurrentPosition(function(position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
          aux = {
          value: position.coords.latitude + ' ' + position.coords.longitude
        }
        
       const  initialWeatherLocation =(aux) => {
          
        const [lat, lon] = aux.value.split(" ")
        const currentWeatherFetch = fetch(
          `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=sp`
        );
        const forecastFetch = fetch(
          `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=sp`
        );

        Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forcastResponse = await response[1].json();

        setCurrentWeather({ city: aux.label, ...weatherResponse });
        setForecast({ city: aux.label, ...forcastResponse });
      })
      .catch((err) =>console.log(err));
       }
        initialWeatherLocation(aux);
      });


    }
    fetchData();
  }, [latitude,longitude])
  
    async function downloadApp() {
    console.log("👍", "butInstall-clicked");
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      // The deferred prompt isn't available.
      console.log("oops, no prompt event guardado en window");
      return;
    }
    // Show the install prompt.
    promptEvent.prompt();
    // Log the result
    const result = await promptEvent.userChoice;
    console.log("👍", "userChoice", result);
    // Reset the deferred prompt variable, since
    // prompt() can only be called once.
    window.deferredPrompt = null;
    // Hide the install button.
    setIsReadyForInstall(false);
  }

  const handleOnSearchChange = (searchData) => {
    setCurrentWeather(null);
    const [lat, lon] = searchData.value.split(" ")
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=sp`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=sp`
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


  const fetchSavedCities  = async () =>{
    const cityStorage = localStorage.getItem("cityStorage"); 
    const queryArr = cityStorage ? JSON.parse(cityStorage) : []; 
    if (queryArr.length) {
      const list = queryArr.join(",")

      console.log("list: " + list);
      console.log("queryArr:"+ queryArr);

     const resp = await fetch(`${WEATHER_API_URL}/group?id=${list}&appid=${WEATHER_API_KEY}&units=metric`)
       .then((res) => res.json())
        .then((data) =>{
       
         data = data.list
          setCitiesData([...data]);

        })

      setSavedCityIds([...queryArr]); 

      setFetchingCities(false);
    } else {
      setFetchingCities(false);
    }
  };


  const onSaveCity = id => {
    let cityArr;
    const cityStorage = localStorage.getItem("cityStorage");
    if (!cityStorage) {
      cityArr = [id];
      localStorage.setItem("cityStorage", JSON.stringify(cityArr));
      return fetchSavedCities();
    }
    const cityStorageArr = JSON.parse(cityStorage); 

    if (!cityStorageArr.includes(id)) {
      cityArr = cityStorageArr.push(id); 
      localStorage.setItem("cityStorage", JSON.stringify(cityStorageArr)); 
      return fetchSavedCities();;
    }
  };

  const removeCity = id => {
    const filteredStorage = JSON.parse(
      localStorage.getItem("cityStorage")
    ).filter(cityId => cityId !== id); 

    localStorage.setItem("cityStorage", JSON.stringify(filteredStorage)); 

    const updatedCities = citiesData.filter(city => city.id !== id); 
    setCitiesData(updatedCities); 
    return setInterval(() => 5000);
  };


  return (
    <>
     <header>
        {isReadyForInstall && (
          <button onClick={downloadApp}> Descargasdasda </button>
        )}
    </header>
    <main className='container'>
      <Search onSearchChange={handleOnSearchChange}/>
      {currentWeather &&
      <section className="current-weather">
       <CurrentWeather weather={currentWeather} />
       <button className="btn-add-favorite" onClick={() => onSaveCity(currentWeather.id)}>Save</button>
      </section>
      }
      {forecast && 
      <section className="forecast">
      <Forecast data={forecast} />
      </section>
      }
      {citiesData && 
      <section className="favorites">
      <WeatherGrid data={citiesData} removeCity={removeCity}/>
      </section>
      }
    </main>   
    </>
 
  );
}

export default App;
