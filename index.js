const express = require('express');
const app = express();
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config()

app.listen(3000, ()=>console.log('listening to port 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/viewCheckinsRoute', (request,response) => {
    database.find({}, (err, data) => {
        if(err){
            response.end();
            return;
        }else{
            response.json(data);
        }
        
    })
    
})

app.post('/apiRoute', (request,response)=>{
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    response.json(data);
    database.insert(data);
})

app.get('/weatherRoute/:latlon', async (request,response) => {
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(latlon);
    console.log(lat,lon);

    const api_key = process.env.API_KEY;
    const weather_api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const weather_response = await fetch(weather_api);
    const weather_data = await weather_response.json();

    const aq_api = `https://api.openaq.org/v2/latest?offset=0&sort=desc&coordinates=${lat}%2c${lon}&order_by=lastUpdated&dumpRaw=false`;
    const aq_response = await fetch(aq_api);
    const aq_data = await aq_response.json();

    const weather = {weather_data, aq_data};

    response.json(weather);
});