const p = document.querySelector('#paragraph');
const cityInput = document.querySelector('#city');
const form = document.querySelector('form');
const apiKey = '48cc82e8f8c02a45326449bdff50a9b3';
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
        p.textContent = result.main.temp;
        if (units == 'metric'){
            p.textContent = `${result.main.temp}°C`;
        } else{
            p.textContent = `${result.main.temp}°F`;
        }
    }

    catch(err){
        console.log(err);
    }

    finally{
        units = undefined;
    }
}

form.addEventListener(("submit"), (e) => {
    e.preventDefault();
    coord = [];
    if(document.getElementById('metric').checked){
        units = 'metric';
    } else if(document.getElementById('imperial').checked){
        units = 'imperial';
    } else{
        p.textContent = "Please select a unit";
        return;
    }
    geoApi(cityInput.value);
})