//GLOBAL API & VARIABLES 
const geoBasedUrl = 'http://api.geonames.org/searchJSON?q=';
const username = 'Mohaz38';
const weBasedUrl = 'http://api.weatherbit.io/v2.0/forecast/daily?';
const weApiKey = 'eb3490b512ca4fe0b339229d8b6d1d18';
let pixaBayBaseUrl = 'https://pixabay.com/api/?key=';
let pixaBayApiKey = '31309714-790f68293239e31d1afb3419d';




const handleSubmit = async (e) => {
    e.preventDefault();

    const cityName = document.getElementById("destination").value;
    const startDate = document.getElementById("Start-date").value;
    const endDate = document.getElementById("end-date").value;

    let date1 = new Date(startDate)
    let date2 = new Date(endDate)
    let diff = date2.getTime() - date1.getTime()
    let millSeconds = 1000 * 3600 * 24;
    let result = diff / millSeconds;


    let geoData = [];
    let weatherData = [];
    let pixaData = [];


    // Get api Data 
    geoData = await geo(geoBasedUrl, username, cityName);
    weatherData = await weatherbit(weBasedUrl, weApiKey, geoData.geonames[0].lat, geoData.geonames[0].lng)
    pixaData = await pixaBay(pixaBayBaseUrl, pixaBayApiKey, cityName)



    //Sending data to backend sever
    postData('http://localhost:8081/postData', {
            cityName: cityName,
            startDate: startDate,
            endDate: endDate,
            image: pixaData,
            weatherData: weatherData,
            tripStart: result,
            trip: result
        })
        // Updating ui
        .then(function(newData) {
            console.log(newData)
            updateUI(pixaData);
        })

}

/* Replacing OpenWeatherApi with Geonames API data */
const geo = async function(geoBasedUrl, username, cityName) {

    const responseTo = await fetch(geoBasedUrl + cityName + '&username=' + username);

    try {
        const data = await responseTo.json();
        console.log(data);
        return data;


    } catch (error) {
        console.log("error", error);
    }

}


/* Weatherbit API */
const weatherbit = async function(weBasedUrl, weApiKey, lat, lng) {

    const response = await fetch(weBasedUrl + 'lat=' + lat + '&lon=' + lng + '&key=' + weApiKey);

    try {
        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.log("error", error);
    }
};



/*  Pixabay API  & Arrow Async Function */
const pixaBay = async (pixaBayBaseUrl, pixaBayApiKey, cityName) => {
    const res = await fetch(pixaBayBaseUrl + pixaBayApiKey + '&q=' + cityName + ' city&image=');

    try {
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log("error", error);
    }
}



/* Function to POST data */
const postData = async (url = '', data = {}) => {
    console.log(data);
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        //Body data type must match Content-Type
        body: JSON.stringify(data),
    });
    try {
        const newData = await res.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log('error', error);
    }
}


/* Function to update UI */
const updateUI = async (pixaData) => {
    const req = await fetch('http://localhost:8081/getData');
    try {
        const addData = await req.json();
        const result = document.getElementById('result');
        result.innerHTML = `
            <div class='details'>
            <h2> City: ${addData.cityName}</h2>
            <img src='https://www.weatherbit.io/static/img/icons/${addData.weatherData.data[0].weather.icon}.png'>
            <p> Starts: ${addData.tripStart} days </p>
            <p> Ends: ${addData.trip} days </p>
            <h4> Temprature ${addData.cityName}: ${addData.weatherData.data[0].temp} degree </h4>
            <div><img src =${pixaData.hits[0].webformatURL} alt='image' ${addData.cityName}></div>
           `;

    } catch (error) {
        console.log('error', error);
    }

}


export { handleSubmit }
