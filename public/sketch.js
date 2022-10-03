if ('geolocation' in navigator) {
    /* geolocation is available */
    navigator.geolocation.getCurrentPosition(async (position) => {
        
        let lat, lon, weather, air;

        try{
          console.log(position.coords);

          lat = position.coords.latitude;
          lon = position.coords.longitude;
          document.getElementById('lat').textContent = lat.toFixed(2);
          document.getElementById('lon').textContent = lon.toFixed(2);

          const weather_api = `/weatherRoute/${lat},${lon}`;
          const weather_response = await fetch(weather_api);
          const weather_data = await weather_response.json();
          console.log(weather_data);

          weather = weather_data.weather_data;
          air = weather_data.aq_data;

          document.getElementById('summary').textContent = weather.weather[0].description;
          document.getElementById('temperature').textContent = weather.main.temp;
          document.getElementById('aq_parameter').textContent = air.results[0].measurements[0].parameter;
          document.getElementById('aq_value').textContent = air.results[0].measurements[0].value;
          document.getElementById('aq_unit').textContent = air.results[0].measurements[0].unit;
          document.getElementById('aq_lastUpdated').textContent = air.results[0].measurements[0].lastUpdated;

          
        }catch(err){
          console.error(err);
          air = { value: -1 };
          document.getElementById('aq_parameter').textContent = 'NO READING';
          document.getElementById('aq_value').textContent = 'NO READING';
          document.getElementById('aq_unit').textContent = 'NO READING';
          document.getElementById('aq_lastUpdated').textContent = 'NO READING';

        }

        const data = {lat, lon, weather, air};
          const options = {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          }
          const response = await fetch('/apiRoute', options);
          const dataFromServer = await response.json();
          console.log(dataFromServer);
        
            
    });
  } else {
    /* geolocation IS NOT available */
  }
