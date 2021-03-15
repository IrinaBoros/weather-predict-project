let temperature = 2;
let feels_like = 3;
let city = "Windermere";
let unit = "C";
let lst = [];
let prs = 1;
let wnd = 4;
let hum = 5;
let icn = "";



let temp1 = document.querySelector(".degrees");
let temp2 = document.querySelector("#temperature");
let placeText = document.querySelector("#placeText");
let humidity = document.querySelector("#humidity");
let pressure = document.querySelector("#pressure");
let wind = document.querySelector("#wind");
let bigImg = document.querySelector("#bigImg");

let button = document.querySelector("#topButton");
button.addEventListener("click", searchCity);
let place = document.querySelector("#place");
place.addEventListener("keypress", keyPress);
let cLoc = document.querySelector("#currentLocation");
cLoc.addEventListener("click", getGeo);
let fah = document.querySelector("#fah");
fah.addEventListener("click", convertToFahrenheit);
let cel = document.querySelector("#cel");
cel.addEventListener("click", convertToCelsius);

function getByCity(city) {
  unit = "C";
  let apiKey = "872504b70f75723c48853df4dd36a3a5";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(`${apiUrl}`).then(writeTemperature);
}

function getForcastByCity(city) {
  unit = "C";
  let apiKey = "872504b70f75723c48853df4dd36a3a5";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric&q=${city}`;
  console.log(apiUrl);
  axios.get(`${apiUrl}`).then(writeForcast);
}

function writeForcast(list) {
  console.log(list);
  renderForcast(list.data.list, "C");
  lst = list.data.list;
}


function renderForcast(list, metric) {
 // console.log(list);
  let hourly=document.querySelector("#hourly");
  let final="";
  for (let x = 3; x <= 8; x++) {
    let template = "";
    let record=list[x];
    template += '<div class="col-sm-2">';
    template += '<div class="forecast-hour text-center">{hour}</div>';
    template += '<div class="forecast-icon text-center"><img src="{icon}" alt="weatherIcon" class="iconImg" /></div>';
    template += '<div class="forecast-temperature text-center">{temp}</div>';
    template += '</div>';
    template=template.replace("{hour}",record.dt_txt.split(" ")[1].substr(0,5));
    if(metric=="C"){
      template=template.replace("{temp}", Math.round(record.main.temp) + "°C");
    } else {
      template=template.replace("{temp}", Math.round(convertToF(record.main.temp)) + "°F");
    }
    template=template.replace("{icon}",`http://openweathermap.org/img/w/${record.weather[0].icon}.png`);
    final+=template;
  }
  hourly.innerHTML=final;
}


function searchCity(event) {
  unit = "C";
  city = place.value;
  placeText.innerHTML = city;
  getByCity(city);
  getForcastByCity(city);

}


function writeTemperature(temp) {
  console.log(temp)
  renderTemperature(temp.data.main.temp, temp.data.main.feels_like, temp.data.name, temp.data.main.humidity, temp.data.main.pressure, temp.data.wind.speed, temp.data.weather[0].icon);

}


function renderTemperature(temp, fl, name, h, p, w, icon) {

  temperature = Math.round(temp);
  feels_like = Math.round(fl);
  city = name;
  hum = h;
  prs= p;
  wnd = w;
  icn= icon;
  temp1.innerHTML = Math.round(temperature) + "°" + unit;
  temp2.innerHTML = `RealFeel ${feels_like} ° ${unit}`;
  placeText.innerHTML = name;
  let now = new Date();

  let paragraph = document.querySelector(".dateTime");
  paragraph.innerHTML = `Updated:${now.toLocaleTimeString()}`;
  humidity.innerHTML = `${h}%`;
  wind.innerHTML = `${w} km/h`;
  pressure.innerHTML = `${p} hpa`;
  bigImg.setAttribute("src", `http://openweathermap.org/img/w/${icon}.png`);
}

function clickCity(city) {
  getByCity(city);
  getForcastByCity(city);

}

function getTempCurrent(position) {
  unit = "C";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "872504b70f75723c48853df4dd36a3a5";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiURL).then(writeTemperature);
  getForcastCurrent(position);
}

function getForcastCurrent(position) {
  unit = "C";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "872504b70f75723c48853df4dd36a3a5";
  let apiURL = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric&lat=${latitude}&lon=${longitude}`;
  axios.get(apiURL).then(writeForcast);
}

function getGeo(event) {
  navigator.geolocation.getCurrentPosition(getTempCurrent);
}

function keyPress(e) {
  let key = e.keyCode;
  if (key == 13) {
    searchCity();
  }
}

function convertToFahrenheit(event) {
  event.preventDefault();
  if (unit == "C") {
    temperature = convertToF(temperature);
    feels_like = convertToF(feels_like);
    unit = "F";
    renderTemperature(temperature, feels_like, city, hum, prs, wnd, icn);
    renderForcast(lst,"F");
  }
}

function convertToCelsius(event) {
  event.preventDefault();
  if (unit == "F") {
    temperature = convertToC(temperature);
    feels_like = convertToC(feels_like);
    unit = "C";
    renderTemperature(temperature, feels_like, city, hum, prs, wnd, icn);
    renderForcast(lst,"C");
  }
}

function convertToF(celsius) {
  let fahrenheit = celsius * 9 / 5 + 32
  return fahrenheit;
}

function convertToC(temperature) {
  return (temperature - 32) * (5 / 9)
}

function getDay(d) {
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[d];
}
let now = new Date(); // change time to show as 08:12 / 17:02 instead of 8:11
let paragraph = document.querySelector(".dateTime");
paragraph.innerHTML = `${getDay(now.getDay())} ${now.getHours()}:${now.getMinutes()}`;

window.onload = () => {
  getGeo();
}




// my spelling sucks  :D is Forecast not forcast but I don't feel like going through all the code to change it  :D:D
// http://openweathermap.org/img/w/

//api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={API key}

//https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric&q=${city}