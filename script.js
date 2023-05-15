const form = document.getElementById("form");
const birthday = document.getElementById("birthday");
const country = document.getElementById("country");
const city = document.getElementById("city");
const randomInfo = document.getElementById("random-info");
const minTemp = document.getElementById("min-temp");
const meanTemp = document.getElementById("mean-temp");
const maxTemp = document.getElementById("max-temp");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const windSpeed = document.getElementById("wind-speed");
const windGusts = document.getElementById("wind-gusts");
const rain = document.getElementById("rain");
const snow = document.getElementById("snow");
const ageYears = document.getElementById("age-years");
const ageMonths = document.getElementById("age-months");
const ageWeeks = document.getElementById("age-weeks");
const ageDays = document.getElementById("age-days");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const birthdayValue = birthday.value.trim();
  const countryValue = country.value.trim().toLowerCase();
  const cityValue = city.value.trim().toLowerCase();
  const birthDate = birthdayValue.slice(5).split("-");

  getAgeData(birthdayValue);

  const [latitude, longitude] = await getCoordinates(
    cityValue,
    countryValue,
    cityValue
  );

  getWeatherData(latitude, longitude, birthdayValue);
  getOnThisDayInfo(birthDate[0], birthDate[1]);
});

// Get city coordinates from Open-Meteo API
const getCoordinates = async (city, targetCountry, targetCity) => {
  let latitude, longitude;

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
    );
    const data = await res.json();

    for (let i = 0; i < data.results.length; i++) {
      if (
        data.results[i].country.toLowerCase() === targetCountry &&
        data.results[i].name.toLowerCase() === targetCity
      ) {
        latitude = data.results[i].latitude;
        longitude = data.results[i].longitude;
        break;
      }
    }
    return [latitude, longitude];
  } catch (err) {
    alert(err);
  }
};

// Get weather data from Open-Meteo API
const getWeatherData = async (latitude, longitude, date) => {
  try {
    const res = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&daily=weathercode,temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,rain_sum,snowfall_sum,windspeed_10m_max,windgusts_10m_max&timezone=auto`
    );
    const data = await res.json();

    minTemp.textContent = data.daily.temperature_2m_min[0];
    meanTemp.textContent = data.daily.temperature_2m_mean[0];
    maxTemp.textContent = data.daily.temperature_2m_max[0];
    sunrise.textContent = data.daily.sunrise[0].slice(-5);
    sunset.textContent = data.daily.sunset[0].slice(-5);
    windSpeed.textContent = data.daily.windspeed_10m_max[0];
    windGusts.textContent = data.daily.windgusts_10m_max[0];
    rain.textContent = data.daily.rain_sum[0];
    snow.textContent = data.daily.snowfall_sum[0];
  } catch (err) {
    alert(err);
  }
};

// Get "on this day" info from Numbers API
const getOnThisDayInfo = async (month, day) => {
  try {
    const res = await fetch(`http://numbersapi.com/${month}/${day}/date?json`);
    const data = await res.json();
    randomInfo.textContent = data.text;
  } catch (err) {
    alert(err);
  }
};

// Calculate age
const getAgeData = (birthday) => {
  const birthDate = new Date(birthday);

  const ageInMilliseconds = Date.now() - Date.parse(birthDate);
  const ageInDays = ageInMilliseconds / 1000 / 60 / 60 / 24;
  const ageInWeeks = ageInDays / 7;
  const ageInMonths = ageInDays / 30.4375;
  const ageInYears = ageInDays / 365.25;

  ageYears.textContent = ageInYears.toFixed(1);
  ageMonths.textContent = ageInMonths.toFixed(1);
  ageWeeks.textContent = ageInWeeks.toFixed(1);
  ageDays.textContent = ageInDays.toFixed(1);
};
