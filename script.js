const p = document.querySelector('#paragraph');
const cityInput = document.querySelector('#city');
const form = document.querySelector('form');
const apiKey = '48cc82e8f8c02a45326449bdff50a9b3';
const body = document.querySelector('body');
let coord;
let units;

async function geoApi(city){
    const geoURL = await `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    const geoData = await fetch(geoURL);
    const geoResult = await geoData.json();
    console.log(geoResult);

    if(geoResult.length == 0){
        p.textContent = "Please enter a valid city";
        return;
    }

    //add logic here to be able to select which of the same name cities they want
    if (geoResult.length > 1){
        console.log("more than one");
    }
    //

    geoResult.forEach(att => {
        var lat = att.lat;
        var lon = att.lon;
        coord.push(lat, lon);
    })

    weather();
}

async function weather(){
    console.log(coord);
    const apiURL = await `https://api.openweathermap.org/data/2.5/weather?lat=${coord[0]}&lon=${coord[1]}&appid=${apiKey}&units=${units}`;
    console.log(units);
    const data = await fetch(apiURL);
    const result = await data.json();
    console.log(result);

    try{
        background(result.main.temp);
    }

    catch(err){
        console.log(err);
    }

    finally{
        units = undefined;
    }

    // temperature
    if (units == 'metric'){
        document.querySelector('#temperature').textContent = `${result.main.temp}°C`;
    } else{
        document.querySelector('#temperature').textContent = `${result.main.temp}°F`;
    }

    //location
    document.querySelector('#location').textContent = `${result.name}, ${result.sys.country}`;

    //time
    const date = new Date();
    let hour;
    let ampm;
    if (date.getHours() > 12){
        hour = date.getHours() - 12;
        ampm = 'PM';
    } else if(date.getHours() === 0){
        hour = 12;
    } else{
        ampm = 'AM';
    }
    document.querySelector('#time').textContent = `${hour}:${date.getMinutes()} ${ampm}`;

    //date
    const dayMap = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    }

    const monthMap = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    }
    
    document.querySelector('#date').textContent = `${dayMap[date.getDay()]}, ${monthMap[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

    // side info
    document.querySelector('#desc').textContent = `Description: ${result.weather[0].description}`;

    if (units == 'metric'){
        document.querySelector('#feels-like').textContent = `Feels like: ${result.main.feels_like}°C`;
    } else{
        document.querySelector('#feels-like').textContent = `Feels like: ${result.main.feels_like}°F`;
    }

    if (units == 'metric'){
        document.querySelector('#wind-speed').textContent = `Wind speed: ${result.wind.speed}m/s`;
    } else{
        document.querySelector('#wind-speed').textContent = `Wind speed: ${result.wind.speed}mph`;
    }

    document.querySelector('#humidity');
}

form.addEventListener(("submit"), (e) => {
    e.preventDefault();
    coord = [];
    if(cityInput.value === ""){
        p.textContent = "Please enter a city";
    } else if(document.getElementById('imperial').checked){
        units = 'imperial';
    } else if(document.getElementById('metric').checked){
        units = 'metric';
    } else{
        p.textContent = "Please select a unit";
        return;
    }
    geoApi(cityInput.value);
})

const background = (temp) => {
    if((units = 'metric' && temp <= 0) || (units = 'imperial' && temp <= 32)){
        body.style.background = 'radial-gradient(circle, rgba(174,194,238,1) 0%, rgba(76,154,245,1) 100%)';
    } else if((units = 'metric' && 0 < temp <= 18.5) || (units = 'imperial' && 32< temp <= 65)){
        body.style.background = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(142,177,236,1) 100%)';
    } else if((units = 'metric' && 18.5 < temp <= 32) || (units = 'imperial' && 65 < temp <= 90)){
        body.style.background = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(233,131,47,1) 100%)';
    } else if((units = 'metric' && 32 < temp) || (units = 'imperial' && 90 < temp )){
        body.style.background = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(250,71,71,1) 100%)';
    }
}