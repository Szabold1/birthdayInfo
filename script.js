const form = document.getElementById("form");
const birthday = document.getElementById("birthday");
const country = document.getElementById("country");
const city = document.getElementById("city");
const randomBirthdayBtn = document.getElementById("random-birthday-btn");
const randomLocationBtn = document.getElementById("random-location-btn");
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
const randomBirths = [
  document.getElementById("random-birth-1"),
  document.getElementById("random-birth-2"),
  document.getElementById("random-birth-3"),
];
const randomDeaths = [
  document.getElementById("random-death-1"),
  document.getElementById("random-death-2"),
  document.getElementById("random-death-3"),
];

// Event listener

// Random birthday button
randomBirthdayBtn.addEventListener("click", setRandomBirthday);

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
  getThisDayInfo(birthDate[0], birthDate[1]);
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
async function getWeatherData(latitude, longitude, date) {
  try {
    const res = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&daily=weathercode,temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,rain_sum,snowfall_sum,windspeed_10m_max,windgusts_10m_max&timezone=auto`
    );
    const data = await res.json();

    minTemp.textContent = data.daily.temperature_2m_min[0];
    meanTemp.textContent = data.daily.temperature_2m_mean[0];
    maxTemp.textContent = data.daily.temperature_2m_max[0];
    if (date.slice(0, 4) >= 1970) {
      sunrise.textContent = data.daily.sunrise[0].slice(-5);
      sunset.textContent = data.daily.sunset[0].slice(-5);
    } else {
      sunrise.textContent = "No data";
      sunset.textContent = "No data";
    }
    windSpeed.textContent = data.daily.windspeed_10m_max[0];
    windGusts.textContent = data.daily.windgusts_10m_max[0];
    rain.textContent = data.daily.rain_sum[0];
    snow.textContent = data.daily.snowfall_sum[0];
  } catch (err) {
    alert(err);
  }
}

// Get "This day" info from Wikipedia API
async function getThisDayInfo(month, day) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${month}/${day}`
    );
    const data = await res.json();
    const randomEvent =
      data.events[Math.floor(Math.random() * data.events.length)];
    randomInfo.textContent = `${randomEvent.text} (${randomEvent.year})`;

    for (let i = 0; i < randomBirths.length; i++) {
      const randomBirth =
        data.births[Math.floor(Math.random() * data.births.length)];
      const randomDeath =
        data.deaths[Math.floor(Math.random() * data.deaths.length)];

      randomBirths[i].textContent = `(${randomBirth.year}) ${randomBirth.text}`;
      randomDeaths[i].textContent = `(${randomDeath.year}) ${randomDeath.text}`;
    }
  } catch (err) {
    alert(err);
  }
}

// Calculate age
function getAgeData(birthday) {
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
}

// Set random birthday
function setRandomBirthday() {
  if (randomBirthdayBtn.checked) {
    const currentYear = new Date().getFullYear();
    let randomDay = Math.floor(Math.random() * 28) + 1;
    let randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomYear = currentYear - Math.floor(Math.random() * 100) - 1;

    if (randomMonth < 10) randomMonth = `0${randomMonth}`;
    if (randomDay < 10) randomDay = `0${randomDay}`;

    birthday.value = `${randomYear}-${randomMonth}-${randomDay}`;

    console.log(`${randomYear}-${randomMonth}-${randomDay}`);
  }
}
