import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./SearchBox.css";
import { useState } from "react";

export default function SearchBox({ updateInfo }) {
  let [city, setCity] = useState("");
  let [error, setError] = useState("");
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "de243c60ac0c7f1221bd8d465c84c34e";

  let getWeatherInfo = async () => {
    try {
      setError(""); // Reset error state before making a new API call
      let response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found"); // Throw error if response status is not ok
      }

      let jsonResponse = await response.json();
      console.log(jsonResponse);

      if (!jsonResponse.main || !jsonResponse.weather[0]) {
        throw new Error("Invalid data"); // Handle unexpected data structure
      }

      let result = {
        city: city,
        temp: jsonResponse.main.temp,
        tempMin: jsonResponse.main.temp_min,
        tempMax: jsonResponse.main.temp_max,
        humidity: jsonResponse.main.humidity,
        feelsLike: jsonResponse.main.feels_like,
        weather: jsonResponse.weather[0].description,
      };
      console.log(result);
      return result;
    } catch (err) {
      setError(err.message || "An error occurred"); // Set error message
      return null; // Return null if there was an error
    }
  };

  let handelChange = (evt) => {
    setCity(evt.target.value);
  };

  let handelSubmit = async (evt) => {
    evt.preventDefault();
    setCity("");
    let newInfo = await getWeatherInfo();
    if (newInfo) {
      updateInfo(newInfo);
    }
  };

  return (
    <div className="searchBox">
      <h3>Search For Weather Forecast</h3>
      <form onSubmit={handelSubmit}>
        <TextField
          className="textField"
          id="outlined-basic"
          label="City Name"
          variant="outlined"
          value={city}
          onChange={handelChange}
          required
        />
        <br></br>
        <br></br>
        <Button variant="contained" type="submit">
          Search
        </Button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
